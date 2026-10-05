import React from 'react';
import { Search, Moon, Sun, Menu, X, Printer, User as UserIcon, LogOut, Mail, CheckCircle2, ShieldAlert, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  onOpenSidebar
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Mobile Menu Button & Mobile Brand */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={onOpenSidebar}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
              مكتبة الرياضيات
            </span>
          </div>

          {/* Central Search Bar */}
          <div className="flex-1 max-w-3xl mx-auto min-w-0">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالعربي أو الإنجليزي: فرق المربعين، فيثاغورس، س² - ٥س، المميز، جيب الزاوية..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pr-10 pl-9 sm:pr-11 sm:pl-10 py-2 sm:py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 shadow-inner transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dark / Light Theme Toggle Only */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onToggleTheme}
              aria-label="تبديل المظهر"
              title={isDark ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
