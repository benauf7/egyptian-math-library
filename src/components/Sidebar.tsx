import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Calculator, 
  Sparkles, 
  Layers, 
  Bookmark, 
  Printer, 
  FileCheck2, 
  Zap, 
  ShieldCheck, 
  ChevronLeft, 
  X,
  LogOut,
  CheckCircle2,
  LogIn,
  ShieldAlert,
  Mail,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 
  | 'dashboard'
  | 'foundations'
  | 'timeline'
  | 'formulas'
  | 'factoring'
  | 'methods'
  | 'lessons'
  | 'favorites'
  | 'print';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenEmailDrawer?: () => void;
  onOpenEmailConfig?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenEmailDrawer,
  onOpenEmailConfig,
  onOpenAdminDashboard
}) => {
  const { user, openAuthModal, logout, sentEmails, unreadEmailsCount } = useAuth();
  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === 'benauf7@gmail.com');

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'الرئيسية', icon: BookOpen, badge: null },
    { id: 'foundations' as NavTab, label: 'الأساسيات والتريكات', icon: Zap, badge: 'جديد' },
    { id: 'timeline' as NavTab, label: 'رحلتي (Timeline)', icon: Clock, badge: '2020-2027' },
    { id: 'formulas' as NavTab, label: 'مكتبة القوانين', icon: Calculator, badge: null },
    { id: 'factoring' as NavTab, label: 'التحليل الرياضي', icon: Layers, badge: null },
    { id: 'methods' as NavTab, label: 'طرق وخوارزميات الحل', icon: Sparkles, badge: null },
    { id: 'lessons' as NavTab, label: 'دروس المنهج', icon: FileCheck2, badge: null },
    { id: 'favorites' as NavTab, label: 'المفضلة والمراجعة', icon: Bookmark, badge: null },
    { id: 'print' as NavTab, label: 'كتاب المكتبة (PDF)', icon: Printer, badge: 'طباعة' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top: Logo & Cohort Badge */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => {
              onSelectTab('dashboard');
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                مكتبة الرياضيات
              </h2>
              <span className="text-[10px] font-bold text-slate-400 block">
                أرشيف المنهج المصري
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Year Cohort Pill */}
        <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>السنة الحالية: 2026/2027</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
            أولى بكالوريا (الصف الأول الثانوي)
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-right ${
                  isActive
                    ? 'bg-gradient-to-l from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Profile Section in Sidebar */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
          {user ? (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user.name}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>حساب مفعل</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="تسجيل الخروج"
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-rose-200 dark:border-rose-900/50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-mono truncate px-1" dir="ltr">
                {user.email}
              </div>

              {/* Admin Special Quick Actions inside Sidebar */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-1.5">
                  {onOpenAdminDashboard && (
                    <button
                      onClick={() => {
                        onOpenAdminDashboard();
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 shadow-sm transition-all"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>لوحة تحكم المسؤول (Dashboard)</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5">
                    {onOpenEmailDrawer && (
                      <button
                        onClick={() => {
                          onOpenEmailDrawer();
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors relative"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>محاكي البريد</span>
                        {unreadEmailsCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                            {unreadEmailsCount}
                          </span>
                        )}
                      </button>
                    )}

                    {onOpenEmailConfig && (
                      <button
                        onClick={() => {
                          onOpenEmailConfig();
                          onClose();
                        }}
                        title="إعدادات خادم البريد"
                        className="flex items-center justify-center gap-1 p-1.5 rounded-xl text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-2">
              <div>
                <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 block">
                  وضع الزائر (غير مسجل)
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  سجل دخولك لتتمكن من حفظ المفضلة وتتبع المراجعة
                </p>
              </div>

              <button
                onClick={() => {
                  openAuthModal('login');
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/25 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول / إنشاء حساب</span>
              </button>
            </div>
          )}

          {/* Ministry Seal */}
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>منهاج معتمد رسمياً • وزارة التربية والتعليم</span>
          </div>
        </div>

      </aside>
    </>
  );
};
