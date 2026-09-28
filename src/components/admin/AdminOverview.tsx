import React from 'react';
import { 
  Users, 
  UserCheck, 
  Calculator, 
  Mail, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  Settings, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Database
} from 'lucide-react';
import { User, SentEmail } from '../../utils/auth-db';
import { MathFormula } from '../../data/types';
import { AdminTab } from './AdminSidebar';

interface AdminOverviewProps {
  users: User[];
  formulas: MathFormula[];
  customFormulasCount: number;
  emails: SentEmail[];
  onNavigate: (tab: AdminTab) => void;
  onOpenAddLaw: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  users,
  formulas,
  customFormulasCount,
  emails,
  onNavigate,
  onOpenAddLaw
}) => {
  const verifiedUsersCount = users.filter(u => u.isVerified).length;
  const unverifiedUsersCount = users.length - verifiedUsersCount;
  const verifiedPercentage = users.length > 0 ? Math.round((verifiedUsersCount / users.length) * 100) : 0;

  // Grade distributions
  const primaryFormulas = formulas.filter(f => f.grade_id?.startsWith('primary'));
  const prepFormulas = formulas.filter(f => f.grade_id?.startsWith('prep'));
  const secFormulas = formulas.filter(f => f.grade_id?.startsWith('sec'));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مرحبا بك في لوحة تحكم المسؤول المعتمد</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              إدارة مكتبة الرياضيات وأرشيف المناهج المعتمدة
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              تحكم كامل في الحسابات وقاعدة البيانات، وإضافة القوانين والمعادلات، ومراقبة خادم البريد وأكواد التحقق اللحظية.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={onOpenAddLaw}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة قانون جديد</span>
            </button>

            <button
              onClick={() => onNavigate('users')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
            >
              <Users className="w-4 h-4" />
              <span>عرض الحسابات ({users.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div 
          onClick={() => onNavigate('users')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
              إجمالي الحسابات المسجلة
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {users.length}
            </span>
            <span className="text-xs font-bold text-slate-400">مستخدم</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            قاعدة البيانات مهيأة لأكثر من 100,000 مستخدم
          </p>
        </div>

        {/* Verified Users */}
        <div 
          onClick={() => onNavigate('users')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
              الحسابات المؤكدة والمفعلة
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {verifiedUsersCount}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              ({verifiedPercentage}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {unverifiedUsersCount} حسابات قيد إدخال رمز التحقق
          </p>
        </div>

        {/* Math Laws Count */}
        <div 
          onClick={() => onNavigate('laws')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
              القوانين والمعادلات المعتمدة
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {formulas.length}
            </span>
            <span className="text-xs font-bold text-slate-400">قانون</span>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-2 font-bold">
            {customFormulasCount > 0 ? `+ ${customFormulasCount} قوانين مخصصة مضافة` : 'تشمل مناهج 4 ابتدائي حتى 1 بكالوريا'}
          </p>
        </div>

        {/* Sent Verification Emails */}
        <div 
          onClick={() => onNavigate('emails')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
              رسائل وأكواد التحقق المرسلة
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {emails.length}
            </span>
            <span className="text-xs font-bold text-slate-400">رسالة</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            تأكيد حسابات واستعادة كلمات المرور
          </p>
        </div>

      </div>

      {/* Curriculum Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stages Distribution Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>توزيع القوانين والمحتوى حسب المراحل التعليمية</span>
            </h3>
            <button
              onClick={() => onNavigate('laws')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>إدارة المحتوى</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Primary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">المرحلة الابتدائية (رابع، خامس، سادس)</span>
                <span className="text-slate-500">{primaryFormulas.length} قانون</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${Math.round((primaryFormulas.length / Math.max(formulas.length, 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Prep */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">المرحلة الإعدادية (أولى، ثانية، ثالثة إعدادي)</span>
                <span className="text-slate-500">{prepFormulas.length} قانون</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${Math.round((prepFormulas.length / Math.max(formulas.length, 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Secondary / Bac */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">المرحلة الثانوية وأولى بكالوريا (2026/2027)</span>
                <span className="text-slate-500">{secFormulas.length} قانون</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-rose-600 transition-all duration-500"
                  style={{ width: `${Math.round((secFormulas.length / Math.max(formulas.length, 1)) * 100)}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            روابط وإجراءات سريعة
          </h3>

          <div className="space-y-2">
            <button
              onClick={onOpenAddLaw}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 text-right transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">إضافة قانون جديد للمكتبة</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-500" />
            </button>

            <button
              onClick={() => onNavigate('users')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">مراجعة الحسابات المسجلة</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('email_config')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">إعدادات خادم البريد (Gmail)</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('backup')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">تصدير نسخة احتياطية (JSON)</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Users Quick Preview Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              أحدث الحسابات المسجلة في الموقع
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              آخر المسجلين في قاعدة بيانات IndexedDB
            </p>
          </div>
          <button
            onClick={() => onNavigate('users')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            عرض جميع المستخدمين ({users.length})
          </button>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            لا توجد حسابات مسجلة بعد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold pb-2">
                  <th className="py-2.5 px-3">الاسم</th>
                  <th className="py-2.5 px-3">البريد الإلكتروني</th>
                  <th className="py-2.5 px-3">الرتبة</th>
                  <th className="py-2.5 px-3">حالة التأكيد</th>
                  <th className="py-2.5 px-3">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                {users.slice(0, 5).map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                          مدير النظام
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          طالب
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مؤكد ومفعل</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>قيد التفعيل</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
