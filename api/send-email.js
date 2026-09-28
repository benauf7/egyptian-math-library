import { sendRealEmail } from '../server/email-handler.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { to, recipientName, subject, code, purpose } = req.body || {};

    if (!to || !isValidEmail(to)) {
      return res.status(400).json({
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

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
