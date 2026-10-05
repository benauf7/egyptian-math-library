import React from 'react';
import { Search, Moon, Sun, Menu, X, Printer, User as UserIcon, LogOut, Mail, CheckCircle2, ShieldAlert, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
  onQuickPrint: () => void;
  onOpenEmailDrawer: () => void;
  onOpenEmailConfig: () => void;
  onOpenAdminDashboard?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  onOpenSidebar,
  onQuickPrint,
  onOpenEmailDrawer,
  onOpenEmailConfig,
  onOpenAdminDashboard
}) => {
  const { user, openAuthModal, logout, unreadEmailsCount, sentEmails } = useAuth();
  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === 'benauf7@gmail.com');

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Mobile Menu Button & Mobile Brand */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[90px] xs:max-w-[130px] sm:max-w-none">
              مكتبة الرياضيات
            </span>
          </div>

          {/* Central Search Bar */}
          <div className="flex-1 min-w-0 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن قانون، فيثاغورس، س²..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-8 pl-7 sm:pr-10 sm:pl-9 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 shadow-inner transition-all truncate"
              />
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Admin Only: Email Simulator Inbox Button */}
            {isAdmin && (
              <button
                onClick={onOpenEmailDrawer}
                title="صندوق محاكي البريد"
                className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {sentEmails.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {sentEmails.length}
                  </span>
                )}
              </button>
            )}

            {/* Admin Only: Real Email Settings Button (benauf7@gmail.com) */}
            {isAdmin && (
              <button
                onClick={onOpenEmailConfig}
                title="إعدادات خادم البريد"
                className="p-1.5 sm:p-2 rounded-xl text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700 transition-colors hidden xs:flex items-center justify-center"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Admin Only: Quick Shortcut to Dashboard */}
            {isAdmin && onOpenAdminDashboard && (
              <button
                onClick={onOpenAdminDashboard}
                title="لوحة التحكم"
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 shadow-sm transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </button>
            )}

            {/* PDF Book Print Button (visible on tablet and desktop) */}
            <button
              onClick={onQuickPrint}
              title="طباعة / حفظ كـ PDF"
              className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              <span>كتاب PDF</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="تبديل المظهر"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Authentication Button / User Profile */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-1.5 pr-1 border-r border-slate-200 dark:border-slate-700">
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80"
                  title={`مسجل باسم: ${user.name} (${user.email})`}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-right">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>مفعل</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="تسجيل الخروج"
                  className="p-1.5 sm:p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 pr-1 border-r border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all shrink-0"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">تسجيل الدخول</span>
                  <span className="xs:hidden">دخول</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
