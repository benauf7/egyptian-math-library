import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  X, 
  Copy, 
  Check, 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Trash2, 
  Inbox,
  Settings
} from 'lucide-react';

import { markAllEmailsAsRead } from '../utils/auth-db';

interface EmailSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmailConfig?: () => void;
}

export const EmailSimulatorDrawer: React.FC<EmailSimulatorDrawerProps> = ({ 
  isOpen, 
  onClose,
  onOpenEmailConfig 
}) => {
  const { sentEmails, openAuthModal } = useAuth();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      markAllEmailsAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string, purpose: 'verification' | 'password_reset', email: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);

    // If modal is not open or needs filling, open relevant tab
    if (purpose === 'verification') {
      openAuthModal('verify', undefined, email);
    } else {
      openAuthModal('reset', undefined, email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-r lg:border-r-0 lg:border-l border-slate-200 dark:border-slate-800 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  محاكي البريد الوارد
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {sentEmails.length} رسائل
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                أكواد التحقق والتأكيد (6 خانات)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenEmailConfig && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmailConfig();
                }}
                title="إعدادات خادم البريد (Gmail/SMTP)"
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explain Banner */}
        <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100/80 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2 leading-relaxed">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              يتم إرسال الأكواد الحقيقية إلى بريد المستخدمين عبر <strong>Gmail / SMTP</strong> ومزامنتها محلياً.
            </span>
          </div>
          {onOpenEmailConfig && (
            <button
              onClick={() => {
                onClose();
                onOpenEmailConfig();
              }}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
            >
              ضبط الخادم
            </button>
          )}
        </div>

        {/* List of Sent Emails */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {sentEmails.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">
                صندوق الوارد فارغ حالياً
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                عند تسجيل حساب جديد أو طلب استعادة كلمة المرور، ستصل رسالة بريد فورية برمز التحقق (6 خانات) وتظهر هنا مباشرة.
              </p>
            </div>
          ) : (
            sentEmails.map((email) => {
              const isReset = email.purpose === 'password_reset';
              const dateStr = new Date(email.sentAt).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div 
                  key={email.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 p-4 shadow-sm hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${
                        isReset 
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' 
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isReset ? <KeyRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </span>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider block text-slate-500 dark:text-slate-400">
                          {isReset ? 'استعادة كلمة المرور' : 'تأكيد الحساب'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {email.subject}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono" dir="ltr">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">إلى:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200" dir="ltr">{email.to}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">المستلم:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{email.recipientName}</span>
                    </div>
                  </div>

                  {/* 6-digit Code Display & Copy */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 block">
                        رمز الأمان (6 خانات)
                      </span>
                      <span className="font-mono text-lg font-black tracking-widest text-indigo-900 dark:text-indigo-200">
                        {email.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(email.id, email.code, email.purpose, email.to)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      {copiedId === email.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ واستخدام</span>
                        </>
                      )}
                    </button>
                  </div>

                  {email.previewUrl && (
                    <a
                      href={email.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الرسالة في خادم البريد (Ethereal Preview)</span>
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            إغلاق الصندوق
          </button>
        </div>
      </div>
    </div>
  );
};
