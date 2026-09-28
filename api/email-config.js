import { getEmailConfig, saveEmailConfig } from '../server/email-handler.js';

const ADMIN_EMAIL = 'benauf7@gmail.com';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const requestAdminEmail = (req.headers['x-admin-email'] || '').toString().trim().toLowerCase();
  const isAdmin = requestAdminEmail === ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'عذراً! هذا الإجراء محمي ومخصص فقط لمدير النظام.'
    });
  }

  if (req.method === 'GET') {
    try {
      const config = getEmailConfig();
      return res.status(200).json({
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
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const saveRes = saveEmailConfig(req.body);
      return res.status(saveRes.success ? 200 : 500).json(saveRes);
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
