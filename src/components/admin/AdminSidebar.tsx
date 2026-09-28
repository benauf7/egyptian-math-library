import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Mail, 
  Settings, 
  Database, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 
  | 'overview'
  | 'users'
  | 'laws'
  | 'emails'
  | 'email_config'
  | 'backup';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onReturnToLibrary: () => void;
  usersCount: number;
  lawsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onReturnToLibrary,
  usersCount,
  lawsCount
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview' as AdminTab, label: 'لوحة التحكم والإحصائيات', icon: LayoutDashboard, badge: null },
    { id: 'users' as AdminTab, label: 'المستخدمين والحسابات', icon: Users, badge: `${usersCount}` },
    { id: 'laws' as AdminTab, label: 'إدارة القوانين والمحتوى', icon: Calculator, badge: `${lawsCount}` },
    { id: 'emails' as AdminTab, label: 'سجل البريد والتحقق', icon: Mail, badge: null },
    { id: 'email_config' as AdminTab, label: 'إعدادات خادم البريد', icon: Settings, badge: 'Gmail' },
    { id: 'backup' as AdminTab, label: 'النسخ الاحتياطي والبيانات', icon: Database, badge: null },
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
        
        {/* Top: Logo & Admin Badge */}
        <div>
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                  لوحة تحكم الإدارة
                </h2>
                <span className="text-[10px] font-bold text-slate-400 block">
                  بوابة إدارة مكتبة الرياضيات
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

          {/* Admin Identity Card */}
          <div className="px-5 py-3 bg-amber-50/60 dark:bg-amber-950/30 border-b border-amber-200/40 dark:border-amber-900/40 text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>المسؤول الرئيسي المعتمد</span>
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold block mt-0.5 truncate">
              {user?.email || 'حساب الإدارة'}
            </span>
          </div>

          {/* Quick Back to Library Button */}
          <div className="p-3">
            <button
              onClick={onReturnToLibrary}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 transition-all shadow-sm group"
            >
              <span>العودة إلى المكتبة الرئيسية</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
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
                      ? 'bg-gradient-to-l from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Actions */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {user?.name || 'مدير النظام'}
                </h4>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>صلاحيات كاملة (Admin)</span>
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
