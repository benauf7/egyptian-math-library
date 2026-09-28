import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  KeyRound, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminEmailConfig: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<'gmail' | 'smtp'>('gmail');
  const [gmailUser, setGmailUser] = useState('benauf7@gmail.com');
  const [gmailAppPass, setGmailAppPass] = useState('');

  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);

  const [testEmail, setTestEmail] = useState('benauf7@gmail.com');
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load configuration
  useEffect(() => {
    fetch('/api/email-config', {
      headers: { 'x-admin-email': user?.email || 'benauf7@gmail.com' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.config) {
          if (data.config.provider === 'gmail' || data.config.host?.includes('gmail')) {
            setProvider('gmail');
            setGmailUser(data.config.user || 'benauf7@gmail.com');
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
  }, [user]);

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
          'x-admin-email': user?.email || 'benauf7@gmail.com'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✅ تم حفظ إعدادات خادم البريد بنجاح! يتم الآن إرسال الأكواد مباشرة إلى بريد المستخدمين.' });
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
          'x-admin-email': user?.email || 'benauf7@gmail.com'
        },
        body: JSON.stringify({ to: testEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        if (data.deliveredToRealInbox) {
          setMessage({
            type: 'success',
            text: `🎉 تم إرسال رسالة اختبار حقيقية بنجاح إلى ${testEmail}! افتح بريدك للتأكد من وصولها فوراً.`
          });
        } else if (data.previewUrl) {
          setMessage({
            type: 'success',
            text: `تم الإرسال عبر خادم الاختبار Ethereal. يمكنك معاينتها من خلال الرابط: ${data.previewUrl}`
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

  const cleanAppPass = gmailAppPass.replace(/\s+/g, '');

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-500" />
          <span>إعدادات خادم البريد الإلكتروني (Gmail / SMTP)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ربط بريد Gmail المعتمد لتصل أكواد التحقق (6 خانات) مباشرة إلى صناديق بريد الطلاب الحقيقية
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`p-4 rounded-3xl border flex items-start gap-3 text-xs leading-relaxed ${
          message.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <p className="font-bold text-sm">{message.text}</p>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Provider Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setProvider('gmail')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              provider === 'gmail'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Gmail (الأسهل والموصى به)
          </button>
          <button
            type="button"
            onClick={() => setProvider('smtp')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              provider === 'smtp'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            خادم SMTP مخصص
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {provider === 'gmail' ? (
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان بريدك في Gmail
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="benauf7@gmail.com"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left font-mono"
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
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>فتح صفحة إنشاء الرمز في جوجل</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={gmailAppPass}
                  onChange={(e) => setGmailAppPass(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tracking-wider text-left"
                />

                {/* Live Character Count Indicator */}
                {gmailAppPass.length > 0 && (
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    {cleanAppPass.length === 16 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>الرمز مكتمل وجاهز (16 حرفاً تماماً)</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>
                          تم إدخال {cleanAppPass.length} من 16 حرفاً
                          {cleanAppPass.length < 16
                            ? ` (ينقصك ${16 - cleanAppPass.length} أحرف)`
                            : ` (تحذير: الرمز يحتوي على رموز زائدة)`}
                        </span>
                      </span>
                    )}
                    <span className="text-slate-400 font-mono font-bold">
                      {cleanAppPass.length} / 16
                    </span>
                  </div>
                )}
              </div>

              {/* Instructions Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <div className="font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>خطوات الحصول على الـ 16 حرفاً في 30 ثانية مجاناً:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pr-1">
                  <li>ادخل على <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">إعدادات أمان حساب جوجل</a> وتأكد من تفعيل "التحقق بخطوتين (2-Step Verification)".</li>
                  <li>افتح صفحة <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">كلمات مرور التطبيقات (App Passwords)</a>.</li>
                  <li>اختر اسماً للتطبيق (مثلاً: <code>Math</code>) واضغط "إنشاء"، وانسخ الـ 16 حرفاً كاملة والصقها في الخانة أعلاه.</li>
                </ol>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">خادم SMTP (Host)</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المنفذ (Port)</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور</label>
                  <input
                    type="password"
                    dir="ltr"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ والتحقق...' : 'حفظ إعدادات خادم البريد'}
            </button>
          </div>

        </form>

      </div>

      {/* Live Email Tester Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-500" />
            <span>تجربة إرسال رسالة بريد حقيقية فورية</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            اكتب بريدك واضغط إرسال للتأكد من وصول الرسالة إلى صندوق الوارد الخاص بك
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            dir="ltr"
            placeholder="myemail@gmail.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left font-mono"
          />

          <button
            onClick={handleTestEmail}
            disabled={isTesting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isTesting ? 'جاري الإرسال...' : 'إرسال رسالة اختبار الآن'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
