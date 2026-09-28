import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  KeyRound, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ExternalLink, 
  Sparkles,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailConfigModal: React.FC<EmailConfigModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === 'benauf7@gmail.com');

  const [provider, setProvider] = useState<'gmail' | 'smtp'>('gmail');
  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPass, setGmailAppPass] = useState('');

  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);

  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Load existing config on open
  useEffect(() => {
    if (isOpen && isAdmin) {
      setMessage(null);
      fetch('/api/email-config', {
        headers: { 'x-admin-email': user?.email || '' }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.config) {
            setIsConfigured(Boolean(data.config.isConfigured));
            if (data.config.provider === 'gmail' || data.config.host?.includes('gmail')) {
              setProvider('gmail');
              setGmailUser(data.config.user || '');
            } else {
              setProvider('smtp');
              setSmtpHost(data.config.host || 'smtp.gmail.com');
              setSmtpPort(String(data.config.port || '465'));
              setSmtpUser(data.config.user || '');
              setSmtpSecure(data.config.secure !== false);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !isAdmin) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (provider === 'gmail') {
      const cleanPass = gmailAppPass.replace(/\s+/g, '');
      if (cleanPass.length !== 16) {
        setMessage({
          type: 'error',
          text: `كلمة مرور تطبيقات Google تتكون دائماً من 16 حرفاً بالتمام (4 مجموعات من 4 أحرف). الرمز المدخل يحتوي على ${cleanPass.length} حرفاً فقط (ينقصك ${16 - cleanPass.length} أحرف). يرجى نسخ الـ 16 حرفاً كاملة.`
        });
        setIsSaving(false);
        return;
      }
    }

    const payload = provider === 'gmail' ? {
      provider: 'gmail',
      user: gmailUser.trim(),
      pass: gmailAppPass.trim(),
      host: 'smtp.gmail.com',
      port: 465,
      secure: true
    } : {
      provider: 'smtp',
      host: smtpHost.trim(),
      port: parseInt(smtpPort, 10) || 465,
      user: smtpUser.trim(),
      pass: smtpPass.trim(),
      secure: smtpSecure
    };

    try {
      const res = await fetch('/api/email-config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || ''
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsConfigured(true);
        setMessage({ type: 'success', text: 'تم حفظ إعدادات خادم البريد بنجاح! سيتم إرسال الأكواد مباشرة إلى بريد المستخدمين.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل حفظ الإعدادات.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'تعذر الاتصال بالخادم لحفظ الإعدادات.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      setMessage({ type: 'error', text: 'يرجى كتابة بريد إلكتروني لإرسال رسالة الاختبار إليه.' });
      return;
    }

    setIsTesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || ''
        },
        body: JSON.stringify({ to: testEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        if (data.deliveredToRealInbox) {
          setMessage({
            type: 'success',
            text: `✅ تم إرسال رسالة اختبار حقيقية بنجاح إلى ${testEmail}! يرجى فتح بريدك والتأكد من وصولها.`
          });
        } else if (data.previewUrl) {
          setMessage({
            type: 'success',
            text: `تم إرسال الرسالة عبر خادم الاختبار (Ethereal). يمكنك معاينتها عبر الرابط بالأسفل.`
          });
        } else {
          setMessage({ type: 'success', text: 'تم إرسال رسالة الاختبار بنجاح.' });
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'فشل إرسال رسالة الاختبار. تأكد من صحة بيانات الحساب.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم أثناء الاختبار.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute left-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  إعدادات إرسال البريد الحقيقي
                </h2>
                {isConfigured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    مضبوط ومفعل ✅
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                لإرسال أكواد التأكيد من 6 خانات إلى البريد الحقيقي للمستخدمين
              </span>
            </div>
          </div>

          {/* Provider Tabs */}
          <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => setProvider('gmail')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                provider === 'gmail'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gmail (الأسهل والأسرع)
            </button>
            <button
              type="button"
              onClick={() => setProvider('smtp')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                provider === 'smtp'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              خادم SMTP مخصص / Brevo
            </button>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-2xl border flex items-start gap-2.5 text-xs leading-relaxed ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            
            {provider === 'gmail' ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان بريدك في Gmail
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="myemail@gmail.com"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-left transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة مرور التطبيقات (App Password) - 16 حرفاً
                    </label>
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>إنشاؤها في جوجل</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={gmailAppPass}
                    onChange={(e) => setGmailAppPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-left font-mono tracking-wider transition-all"
                  />
                  {gmailAppPass.length > 0 && (
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      {gmailAppPass.replace(/\s+/g, '').length === 16 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>الرمز مكتمل (16 حرفاً تماماً)</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>
                            تم إدخال {gmailAppPass.replace(/\s+/g, '').length} من 16 حرفاً
                            {gmailAppPass.replace(/\s+/g, '').length < 16
                              ? ` (ينقصك ${16 - gmailAppPass.replace(/\s+/g, '').length} أحرف)`
                              : ` (تأكد من عدم وجود رموز إضافية)`}
                          </span>
                        </span>
                      )}
                      <span className="text-slate-400 font-mono">
                        {gmailAppPass.replace(/\s+/g, '').length}/16
                      </span>
                    </div>
                  )}
                </div>

                {/* How-to helper card */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                  <div className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>كيفية إنشاء كلمة مرور التطبيقات في 30 ثانية مجاناً:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pr-1">
                    <li>ادخل على صفحة <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">أمان حساب جوجل</a>.</li>
                    <li>تأكد من تفعيل <strong>التحقق بخطوتين (2-Step Verification)</strong>.</li>
                    <li>افتح صفحة <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">كلمات مرور التطبيقات</a>.</li>
                    <li>اكتب اسم التطبيق (مثلاً: <code>Math</code>) واضغط إنشاء، وانسخ الـ 16 حرفاً وضعها هنا.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      خادم SMTP (Host)
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="smtp.example.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      المنفذ (Port)
                    </label>
                    <input
                      type="number"
                      required
                      dir="ltr"
                      placeholder="465"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المستخدم (Username)
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="user@example.com"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    كلمة المرور (Password / API Key)
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>حفظ وتفعيل خادم البريد الحقيقي</span>
            </button>
          </form>

          {/* Test Dispatch Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              اختبار إرسال رسالة فعلية الآن:
            </span>
            <div className="flex gap-2">
              <input
                type="email"
                dir="ltr"
                placeholder="أدخل بريدك لتلقي رسالة تجريبية"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTesting}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-60"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 rotate-180" />}
                <span>إرسال اختبار</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
