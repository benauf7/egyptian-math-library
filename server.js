import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendRealEmail, getEmailConfig, saveEmailConfig } from './server/email-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');
const ADMIN_EMAIL = 'benauf7@gmail.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Rate limiter map
const rateLimitMap = new Map();
function isRateLimited(key, maxLimit = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (record.count >= maxLimit) return true;
  record.count += 1;
  return false;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50000) reject(new Error('Payload too large'));
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
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.end(JSON.stringify(data));
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (/[\r\n\0%<>]/.test(email)) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
  const requestAdminEmail = (req.headers['x-admin-email'] || '').toString().trim().toLowerCase();
  const isAdmin = requestAdminEmail === ADMIN_EMAIL;

  // 1. API Endpoint: Send Email
  if (urlPath === '/api/send-email' && req.method === 'POST') {
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

  // 2. API Endpoint: Get Email Config (Admin Only)
  if (urlPath === '/api/email-config' && req.method === 'GET') {
    if (!isAdmin) {
      return sendJsonResponse(res, 403, {
        success: false,
        error: 'عذراً! هذا المسار محمي وخاص حصرياً بمدير النظام.'
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

  // 3. API Endpoint: Save Email Config (Admin Only)
  if (urlPath === '/api/email-config' && req.method === 'POST') {
    if (!isAdmin) {
      return sendJsonResponse(res, 403, {
        success: false,
        error: 'عذراً! لا تملك صلاحية تعديل إعدادات البريد.'
      });
    }

    try {
      const body = await readJsonBody(req);
      const saveRes = saveEmailConfig(body);
      return sendJsonResponse(res, saveRes.success ? 200 : 500, saveRes);
    } catch (e) {
      return sendJsonResponse(res, 500, { success: false, error: e.message });
    }
  }

  // 4. API Endpoint: Test Email (Admin Only)
  if (urlPath === '/api/test-email' && req.method === 'POST') {
    if (!isAdmin) {
      return sendJsonResponse(res, 403, {
        success: false,
        error: 'عذراً! غير مصرح لك بإجراء اختبار خادم البريد.'
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
        recipientName: 'مدير النظام',
        subject: 'رسالة اختبار: تم تأكيد اتصال خادم بريد مكتبة الرياضيات',
        code: 'S9E8C7',
        purpose: 'verification'
      });

      return sendJsonResponse(res, 200, result);
    } catch (e) {
      return sendJsonResponse(res, 500, { success: false, error: e.message });
    }
  }

  // 5. Static File Serving (dist directory)
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  // Check if file exists, else fallback to index.html for SPA (e.g. /dashboard)
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Cache assets for performance
      if (filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }

      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`✅ Egyptian Math Archive Production Server running on port ${PORT}`);
});
