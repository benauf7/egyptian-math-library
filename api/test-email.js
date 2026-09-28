import { sendRealEmail, getEmailConfig } from '../server/email-handler.js';

const ADMIN_EMAIL = 'benauf7@gmail.com';

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (/[\r\n\0%<>]/.test(email)) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const requestAdminEmail = (req.headers['x-admin-email'] || '').toString().trim().toLowerCase();
  const isAdmin = requestAdminEmail === ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'عذراً! غير مصرح لك بإجراء اختبار خادم البريد.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const targetEmail = req.body?.to || getEmailConfig().user;

    if (!targetEmail || !isValidEmail(targetEmail)) {
      return res.status(400).json({
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

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
