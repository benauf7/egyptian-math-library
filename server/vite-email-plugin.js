import { sendRealEmail, getEmailConfig, saveEmailConfig } from './email-handler.js';

const ADMIN_EMAIL = 'benauf7@gmail.com';

// In-memory rate limiting map: ip/email -> { count, resetAt }
const rateLimitMap = new Map();

function isRateLimited(key, maxLimit = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxLimit) {
    return true;
  }

  record.count += 1;
  return false;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against huge payload attacks
      if (body.length > 50000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJsonResponse(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.end(JSON.stringify(data));
}

// Strict email validator (RFC compliant, no header injection characters)
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (/[\r\n\0%<>]/.test(email)) return false; // Prevent SMTP injection
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function emailServerPlugin() {
  return {
    name: 'vite-email-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local';

        // Check if admin request is authorized
        const requestAdminEmail = (req.headers['x-admin-email'] || '').toString().trim().toLowerCase();
        const isAdmin = requestAdminEmail === ADMIN_EMAIL;

        // Route: POST /api/send-email (Rate limited & sanitized)
        if (url === '/api/send-email' && req.method === 'POST') {
          try {
            if (isRateLimited(`send_${clientIp}`, 10, 60000)) {
              return sendJsonResponse(res, 429, {
                success: false,
                error: 'تم تجاوز الحد الأقصى لإرسال الرسائل. يرجى الانتظار لمدة دقيقة والمحاولة مرة أخرى.'
              });
            }

            const body = await readJsonBody(req);
            const { to, recipientName, subject, code, purpose } = body;

            if (!to || !isValidEmail(to)) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: 'عنوان البريد الإلكتروني غير صالح أو يحتوي على رموز غير مسموحة.'
              });
            }

            // Clean inputs against header injection
            const cleanRecipient = (recipientName || '').replace(/[\r\n\0]/g, '').slice(0, 80);
            const cleanSubject = (subject || '').replace(/[\r\n\0]/g, '').slice(0, 150);
            const cleanCode = (code || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 6);

            const result = await sendRealEmail({
              to: to.trim().toLowerCase(),
              recipientName: cleanRecipient,
              subject: cleanSubject,
              code: cleanCode,
              purpose
            });

            return sendJsonResponse(res, 200, result);
          } catch (e) {
            return sendJsonResponse(res, 500, { success: false, error: e.message });
          }
        }

        // Route: GET /api/email-config (Strictly Protected: benauf7@gmail.com Only)
        if (url === '/api/email-config' && req.method === 'GET') {
          if (!isAdmin) {
            return sendJsonResponse(res, 403, {
              success: false,
              error: 'عذراً! هذا المسار محمي وخاص حصرياً بمدير النظام (benauf7@gmail.com).'
            });
          }

          try {
            const config = getEmailConfig();
            return sendJsonResponse(res, 200, {
              success: true,
              config: {
                provider: config.provider || 'none',
                user: config.user || '',
                host: config.host || 'smtp.gmail.com',
                port: config.port || 465,
                secure: config.secure !== false,
                fromName: config.fromName || 'مكتبة الرياضيات الشخصية',
                fromEmail: config.fromEmail || '',
                isConfigured: Boolean(config.user && config.pass)
              }
            });
          } catch (e) {
            return sendJsonResponse(res, 500, { success: false, error: e.message });
          }
        }

        // Route: POST /api/email-config (Strictly Protected: benauf7@gmail.com Only)
        if (url === '/api/email-config' && req.method === 'POST') {
          if (!isAdmin) {
            return sendJsonResponse(res, 403, {
              success: false,
              error: 'غير مصرح: لا يمكن تعديل إعدادات خادم البريد إلا بحساب المدير (benauf7@gmail.com).'
            });
          }

          try {
            const body = await readJsonBody(req);
            const saveRes = saveEmailConfig(body);
            return sendJsonResponse(res, 200, saveRes);
          } catch (e) {
            return sendJsonResponse(res, 500, { success: false, error: e.message });
          }
        }

        // Route: POST /api/test-email (Strictly Protected: benauf7@gmail.com Only)
        if (url === '/api/test-email' && req.method === 'POST') {
          if (!isAdmin) {
            return sendJsonResponse(res, 403, {
              success: false,
              error: 'غير مصرح: اختبار الخادم متاح فقط للمدير (benauf7@gmail.com).'
            });
          }

          try {
            const body = await readJsonBody(req);
            const targetEmail = body.to || getEmailConfig().user;

            if (!targetEmail || !isValidEmail(targetEmail)) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: 'يرجى كتابة عنوان بريد إلكتروني صالح للاختبار.'
              });
            }

            const result = await sendRealEmail({
              to: targetEmail,
              recipientName: 'مدير النظام (أحمد بن عوف)',
              subject: 'رسالة اختبار: تم تأكيد اتصال خادم بريد مكتبة الرياضيات',
              code: 'S9E8C7',
              purpose: 'verification'
            });

            return sendJsonResponse(res, 200, result);
          } catch (e) {
            return sendJsonResponse(res, 500, { success: false, error: e.message });
          }
        }

        next();
      });
    }
  };
}
