import React, { useState, useEffect } from 'react';
import { useAuth, AuthModalTab } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Send,
  RefreshCw,
  Copy,
  Info,
  ExternalLink,
  Settings
} from 'lucide-react';

interface AuthModalProps {
  onOpenEmailConfig?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenEmailConfig }) => {
  const { 
    user,
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    authModalReason, 
    pendingEmail,
    sentEmails,
    login, 
    register, 
    verifyEmail, 
    forgotPassword, 
    resetPassword,
    resendCode
  } = useAuth();

  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === 'benauf7@gmail.com');

  // Active sub-tab in modal
  const [tab, setTab] = useState<AuthModalTab>(authModalTab);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // UX states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync tab and pending email from context
  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab);
      setErrorMessage('');
      setSuccessMessage('');
      if (pendingEmail) {
        setEmail(pendingEmail);
      }
    }
  }, [isAuthModalOpen, authModalTab, pendingEmail]);

  if (!isAuthModalOpen) return null;

  // Find latest simulated email matching current target email
  const latestEmail = sentEmails.find(e => e.to.toLowerCase() === email.trim().toLowerCase());

  const handleSwitchTab = (newTab: AuthModalTab) => {
    setTab(newTab);
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
  };

  const handleFillCode = (code: string) => {
    setVerificationCode(code.toUpperCase());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage('تم تسجيل الدخول بنجاح! جاري المتابعة...');
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء محاولة تسجيل الدخول.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('كلمة المرور وتأكيد كلمة المرور غير متطابقين!');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تتكون من 6 أحرف أو أرقام على الأقل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(name, email, password);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        // Field must remain completely blank so user opens their email and enters the code
        setVerificationCode('');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء محاولة إنشاء الحساب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setErrorMessage('يرجى إدخال رمز التأكيد المكون من 6 خانات (أحرف كبيرة وأرقام).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyEmail(email, verificationCode);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage('تهانينا! تم تفعيل حسابك بنجاح.');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء التحقق من الرمز.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني المسجل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        setVerificationCode('');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء طلب استعادة كلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setErrorMessage('يرجى إدخال رمز الاستعادة المكون من 6 خانات.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('كلمة المرور الجديدة وتأكيدها غير متطابقين!');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(email, verificationCode, password);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage('تم تعيين كلمة المرور الجديدة وتأكيد دخولك بنجاح!');
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء إعادة تعيين كلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await resendCode(email);
      if (res.success) {
        setSuccessMessage(res.message);
        setVerificationCode('');
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900">
          <button
            onClick={closeAuthModal}
            className="absolute left-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              {tab === 'login' && <Lock className="w-5 h-5" />}
              {tab === 'register' && <UserIcon className="w-5 h-5" />}
              {tab === 'verify' && <ShieldCheck className="w-5 h-5" />}
              {tab === 'forgot' && <KeyRound className="w-5 h-5" />}
              {tab === 'reset' && <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {tab === 'login' && 'تسجيل الدخول'}
                {tab === 'register' && 'إنشاء حساب جديد'}
                {tab === 'verify' && 'تأكيد البريد الإلكتروني'}
                {tab === 'forgot' && 'نسيت كلمة المرور'}
                {tab === 'reset' && 'تعيين كلمة مرور جديدة'}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                مكتبة الرياضيات الشخصية • نظام الحسابات
              </span>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          {(tab === 'login' || tab === 'register') && (
            <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => handleSwitchTab('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                إنشاء حساب
              </button>
            </div>
          )}
        </div>

        {/* Reason / Notice Banner (if triggered by clicking Favorite or Reviewed) */}
        {authModalReason && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="font-bold">{authModalReason}</p>
          </div>
        )}

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('forgot')}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <span>ليس لديك حساب بعد؟ </span>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('register')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  إنشاء حساب مجاني جديد
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block leading-tight">
                  ✨ يمكنك تصفح كافة القوانين والشروحات والدروس كـ <strong>زائر</strong> مجاناً بدون تسجيل، والتسجيل يتيح لك حفظ المفضلة وتتبع المراجعة.
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم بالكامل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد علي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور (6 خانات على الأقل)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>سيتم إرسال رمز تأكيد من 6 خانات (أحرف إنجليزية كبيرة وأرقام) إلى بريدك فوراً.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>إنشاء الحساب وإرسال الرمز</span>
                    <Send className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <span>لديك حساب بالفعل؟ </span>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: VERIFY EMAIL (6 CHARS: UPPERCASE + DIGITS) */}
          {tab === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <p className="font-extrabold text-sm">
                    تم إرسال رمز التأكيد إلى بريدك الإلكتروني:
                  </p>
                </div>
                <div className="font-mono text-center font-bold text-sm bg-white dark:bg-slate-900 p-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 select-all" dir="ltr">
                  {email}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  يرجى فتح بريدك الإلكتروني والبحث عن رسالة من <strong>مكتبة الرياضيات الشخصية</strong> (تحقق أيضاً من مجلد الرسائل غير المرغوب فيها / Spam)، ثم اكتب رمز التأكيد المكون من 6 خانات أدناه.
                </p>

                {/* Direct Webmail Links */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/60">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>فتح Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://outlook.live.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>فتح Outlook</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://mail.yahoo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>فتح Yahoo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Ethereal web preview if sent via test relay (Admin Only) */}
                {isAdmin && latestEmail?.previewUrl && (
                  <div className="pt-1">
                    <a
                      href={latestEmail.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>عرض الرسالة المرسلة في متصفح البريد (Ethereal Preview)</span>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                  أدخل رمز التأكيد (6 خانات: أحرف كبيرة + أرقام)
                </label>
                <div className="relative max-w-[260px] mx-auto">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    dir="ltr"
                    placeholder="مثال: K7P9X2"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    className="w-full text-center tracking-[0.35em] text-xl font-mono font-black py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-inner uppercase transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1">
                  الرمز يتكون من 6 خانات (أحرف إنجليزية كبيرة A-Z وأرقام 2-9)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد وتفعيل الحساب الآن</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة إرسال الرمز</span>
                </button>

                {isAdmin && onOpenEmailConfig ? (
                  <button
                    type="button"
                    onClick={onOpenEmailConfig}
                    className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>إعداد بريد الإرسال (Gmail)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('login')}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
                  >
                    العودة لتسجيل الدخول
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                أدخل عنوان بريدك الإلكتروني المسجل لدينا، وسنرسل لك رمز تحقق مكون من 6 خانات لإعادة تعيين كلمة المرور فوراً.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  البريد الإلكتروني المسجل
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>إرسال رمز الاستعادة (6 خانات)</span>
                    <Send className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  تذكرت كلمة المرور؟ تسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: RESET PASSWORD */}
          {tab === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-300 space-y-2">
                <p>
                  تم إرسال رمز الاستعادة (6 خانات) إلى بريدك الإلكتروني: <strong>{email}</strong>. يرجى فتح بريدك وكتابة الرمز وكلمة المرور الجديدة.
                </p>

                {/* Direct Webmail Links */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/60">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <span>فتح Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://outlook.live.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <span>فتح Outlook</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Ethereal web preview if sent via test relay (Admin Only) */}
                {isAdmin && latestEmail?.previewUrl && (
                  <div className="pt-1">
                    <a
                      href={latestEmail.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>عرض رسالة الاستعادة في متصفح البريد (Ethereal Preview)</span>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رمز التحقق (6 خانات: أحرف كبيرة + أرقام)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    dir="ltr"
                    placeholder="مثال: X8K2P4"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 focus:outline-none uppercase transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور الجديدة (6 خانات على الأقل)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-left transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>حفظ كلمة المرور الجديدة والدخول</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  إلغاء والعودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
