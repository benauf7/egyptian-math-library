import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminLaws } from './AdminLaws';
import { AdminEmails } from './AdminEmails';
import { AdminEmailConfig } from './AdminEmailConfig';
import { AdminBackup } from './AdminBackup';
import { User, getAllUsers, SentEmail, getRecentEmails } from '../../utils/auth-db';
import { MathFormula } from '../../data/types';
import { getAllActiveFormulas, getCustomFormulas } from '../../utils/custom-laws-db';
import { 
  ShieldAlert, 
  Lock, 
  LogIn, 
  ArrowRight, 
  Moon, 
  Sun, 
  Menu, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface AdminDashboardProps {
  onReturnToLibrary: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToLibrary,
  isDark,
  onToggleTheme
}) => {
  const { user, openAuthModal } = useAuth();
  const isAdmin = Boolean(user && user.email.trim().toLowerCase() === 'benauf7@gmail.com');

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formulas, setFormulas] = useState<MathFormula[]>([]);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [isAddLawModalOpen, setIsAddLawModalOpen] = useState(false);

  // Refresh functions
  const loadUsers = async () => {
    const list = await getAllUsers();
    setUsers(list);
  };

  const loadFormulas = () => {
    const all = getAllActiveFormulas();
    setFormulas(all);
  };

  const loadEmails = async () => {
    const list = await getRecentEmails();
    setEmails(list);
  };

  const refreshAll = () => {
    loadUsers();
    loadFormulas();
    loadEmails();
  };

  useEffect(() => {
    if (isAdmin) {
      refreshAll();
    }
  }, [isAdmin]);

  // If unauthorized: Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl text-center space-y-6 animate-fadeIn backdrop-blur-md">
          
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>منطقة محظورة • صلاحيات الإدارة فقط</span>
            </div>
            <h2 className="text-xl font-black">
              لوحة تحكم المسؤول مقيدة
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              هذه الصفحة مخصصة حصرياً لمدير النظام. يرجى تسجيل الدخول بحساب المسؤول المعتمد للوصول إلى لوحة التحكم.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول كمسؤول الآن</span>
            </button>

            <button
              onClick={onReturnToLibrary}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>العودة إلى المكتبة التعليمية</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  const customFormulasCount = getCustomFormulas().length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Right Sidebar for RTL Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onReturnToLibrary={onReturnToLibrary}
        usersCount={users.length}
        lawsCount={formulas.length}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72 transition-all">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              
              {/* Mobile Menu & Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    لوحة الإدارة
                  </span>
                  <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {currentTab === 'overview' && 'نظرة عامة وإحصائيات'}
                    {currentTab === 'users' && 'المستخدمين وقاعدة البيانات'}
                    {currentTab === 'laws' && 'إدارة القوانين والمناهج'}
                    {currentTab === 'emails' && 'سجل رسائل وأكواد البريد'}
                    {currentTab === 'email_config' && 'خادم البريد (Gmail)'}
                    {currentTab === 'backup' && 'النسخ الاحتياطي'}
                  </span>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                
                {/* Back to Library Link */}
                <button
                  onClick={onReturnToLibrary}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">عرض المكتبة</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={onToggleTheme}
                  aria-label="تبديل المظهر"
                  className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {/* Admin Status Pill */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{user?.email || 'مدير النظام'}</span>
                </div>

              </div>

            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
          
          {currentTab === 'overview' && (
            <AdminOverview
              users={users}
              formulas={formulas}
              customFormulasCount={customFormulasCount}
              emails={emails}
              onNavigate={setCurrentTab}
              onOpenAddLaw={() => setCurrentTab('laws')}
            />
          )}

          {currentTab === 'users' && (
            <AdminUsers
              users={users}
              currentSessionUser={user}
              onRefreshUsers={loadUsers}
            />
          )}

          {currentTab === 'laws' && (
            <AdminLaws
              formulas={formulas}
              onRefreshFormulas={loadFormulas}
              isOpenAddModal={isAddLawModalOpen}
              onCloseAddModal={() => setIsAddLawModalOpen(false)}
            />
          )}

          {currentTab === 'emails' && (
            <AdminEmails
              emails={emails}
              onRefreshEmails={loadEmails}
            />
          )}

          {currentTab === 'email_config' && (
            <AdminEmailConfig />
          )}

          {currentTab === 'backup' && (
            <AdminBackup onRefreshAll={refreshAll} />
          )}

        </main>

      </div>

    </div>
  );
};
