import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.resolve(process.cwd(), 'email-config.json');

// Get stored configuration
export function getEmailConfig() {
  // Check email-config.json
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading email-config.json:', e);
    }
  }

  // Fallback to process.env
  return {
    provider: process.env.EMAIL_PROVIDER || 'none', // 'gmail' | 'smtp' | 'ethereal'
    user: process.env.SMTP_USER || process.env.GMAIL_USER || '',
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || '',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: (process.env.SMTP_SECURE !== 'false'),
    fromName: process.env.EMAIL_FROM_NAME || 'مكتبة الرياضيات الشخصية',
    fromEmail: process.env.EMAIL_FROM_ADDRESS || ''
  };
}

// Save configuration
export function saveEmailConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

let etherealAccountCache = null;

async function getTransporter(config) {
  if (config && config.user && config.pass) {
    const cleanUser = String(config.user).trim();
    const cleanPass = String(config.pass).replace(/\s+/g, '').trim();

    if (config.provider === 'gmail' || config.host?.includes('gmail')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser,
          pass: cleanPass
        }
      });
    }

    return nodemailer.createTransport({
      host: config.host || 'smtp.gmail.com',
      port: config.port || 465,
      secure: config.port === 465,
      auth: {
        user: cleanUser,
        pass: cleanPass
      }
    });
  }

  // Fallback to real Ethereal SMTP test account
  if (!etherealAccountCache) {
    etherealAccountCache = await nodemailer.createTestAccount();
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: etherealAccountCache.user,
      pass: etherealAccountCache.pass
    }
  });
}

export function generateEmailHtml(recipientName, code, purpose) {
  const isReset = purpose === 'password_reset';
  const title = isReset ? 'إعادة تعيين كلمة المرور' : 'تأكيد إنشاء الحساب';
  const desc = isReset
    ? 'تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في مكتبة الرياضيات الشخصية.'
    : 'أهلاً بك في مكتبة الرياضيات الشخصية (أرشيف مناهج مصر المعتمدة). يرجى تأكيد حسابك للبدء في حفظ وتتبع المذاكرة.';

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 35px 30px 20px 30px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);">
                  <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 12px 18px; margin-bottom: 12px;">
                    <span style="font-size: 26px; color: #ffffff;">📐 🧮</span>
                  </div>
                  <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">مكتبة الرياضيات الشخصية</h1>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #c7d2fe; font-weight: bold;">أرشيف المناهج المصرية الرسمية (2020 - 2027)</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 35px 30px; text-align: right;" dir="rtl">
                  <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #0f172a;">مرحباً بك يا ${recipientName || 'طالبنا العزيز'} 👋</h2>
                  <p style="margin: 0 0 25px 0; font-size: 14px; line-height: 1.7; color: #334155;">
                    ${desc}
                  </p>

                  <div style="background-color: #f1f5f9; border: 2px dashed #6366f1; border-radius: 18px; padding: 22px; text-align: center; margin: 25px 0;">
                    <span style="display: block; font-size: 12px; font-weight: bold; color: #4338ca; margin-bottom: 8px;">
                      رمز التأكيد المكون من 6 خانات
                    </span>
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #312e81; display: inline-block;" dir="ltr">
                      ${code}
                    </span>
                  </div>

                  <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                    ⏰ <strong>ملاحظة هامة:</strong> هذا الرمز صالح لمدة <strong>15 دقيقة فقط</strong>. يرجى كتابته في شاشة التأكيد في الموقع لإتمام العملية.
                  </p>

                  <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                    إذا لم تكن أنت من قام بهذا الإجراء، يمكنك تجاهل هذا البريد ولن يتم اتخاذ أي إجراء على حسابك.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;" dir="rtl">
                  <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
                    مكتبة الرياضيات الشخصية • تم إرسال هذه الرسالة الآلية لتأمين حسابك
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Main Send Function
export async function sendRealEmail({ to, recipientName, subject, code, purpose }) {
  const config = getEmailConfig();
  const isRealSmtp = Boolean(config && config.user && config.pass);

  try {
    const transporter = await getTransporter(config);
    const fromAddress = config.fromEmail || config.user || '"مكتبة الرياضيات" <no-reply@egyptian-math.edu.eg>';
    const fromName = config.fromName || 'مكتبة الرياضيات الشخصية';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: to.trim().toLowerCase(),
      subject: subject || (purpose === 'password_reset' ? 'رمز استعادة كلمة المرور' : 'رمز تأكيد حسابك في مكتبة الرياضيات'),
      text: `مرحباً ${recipientName}، رمز التأكيد الخاص بك المكون من 6 خانات هو: ${code}. هذا الرمز صالح لمدة 15 دقيقة.`,
      html: generateEmailHtml(recipientName, code, purpose)
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    return {
      success: true,
      messageId: info.messageId,
      deliveredToRealInbox: isRealSmtp,
      provider: isRealSmtp ? (config.provider || 'smtp') : 'ethereal',
      previewUrl,
      recipient: to
    };
  } catch (error) {
    console.error('Email sending error:', error);
    let errMsg = error.message || 'فشل إرسال البريد الإلكتروني.';
    if (errMsg.includes('535') || errMsg.includes('BadCredentials') || errMsg.includes('Username and Password not accepted')) {
      errMsg = 'خطأ في المصادقة من جوجل (535 Bad Credentials): كلمة مرور التطبيق (App Password) غير صحيحة أو ناقصة. تأكد من إدخال الـ 16 حرفاً كاملة وتفعيل التحقق بخطوتين (2-Step Verification) في حساب Google.';
    }
    return {
      success: false,
      error: errMsg
    };
  }
}
