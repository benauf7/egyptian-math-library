import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Plus, 
  UserPlus, 
  AlertTriangle,
  RefreshCw,
  Mail,
  KeyRound
} from 'lucide-react';
import { User, saveUser, deleteUserById, registerNewUser } from '../../utils/auth-db';

interface AdminUsersProps {
  users: User[];
  currentSessionUser: User | null;
  onRefreshUsers: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  currentSessionUser,
  onRefreshUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified' | 'admin'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'verified') return u.isVerified;
    if (filterStatus === 'unverified') return !u.isVerified;
    if (filterStatus === 'admin') return u.role === 'admin' || u.email === 'benauf7@gmail.com';
    return true;
  });

  const verifiedCount = users.filter(u => u.isVerified).length;
  const unverifiedCount = users.length - verifiedCount;

  // Toggle user verification
  const handleToggleVerification = async (user: User) => {
    user.isVerified = !user.isVerified;
    if (user.isVerified) {
      user.verificationCode = undefined;
      user.failedVerificationAttempts = 0;
      user.verificationLockedUntil = 0;
    }
    await saveUser(user);
    onRefreshUsers();
  };

  // Delete user
  const handleDeleteUser = async (user: User) => {
    if (user.email === 'benauf7@gmail.com') {
      alert('لا يمكن حذف حساب المسؤول الرئيسي!');
      return;
    }

    const confirmDelete = window.confirm(`هل أنت متأكد من حذف حساب الطالب "${user.name}" (${user.email}) نهائياً؟`);
    if (confirmDelete) {
      await deleteUserById(user.id);
      onRefreshUsers();
    }
  };

  // Create new user directly
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMsg(null);

    try {
      const res = await registerNewUser(newName, newEmail, newPassword);
      if (res.success) {
        setFormMsg({ type: 'success', text: `تم إنشاء الحساب بنجاح! رمز التأكيد: ${res.code}` });
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        onRefreshUsers();
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    } catch {
      setFormMsg({ type: 'error', text: 'حدث خطأ أثناء إنشاء الحساب.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and Stats Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-500" />
            <span>إدارة الحسابات وقاعدة بيانات المستخدمين</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            متابعة حالة الطلاب، وتأكيد الحسابات، وإدارة الصلاحيات
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة طالب يدوياً</span>
          </button>

          <button
            onClick={onRefreshUsers}
            title="تحديث القائمة"
            className="p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">إجمالي الحسابات المسجلة</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{users.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">الحسابات المؤكدة</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{verifiedCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">قيد إدخال الرمز</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block mt-1">{unverifiedCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">الحساب النشط حالياً</span>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block mt-1.5 truncate">
            {currentSessionUser?.name || 'مدير النظام'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `الكل (${users.length})` },
            { id: 'verified', label: `مفعل (${verifiedCount})` },
            { id: 'unverified', label: `قيد التأكيد (${unverifiedCount})` },
            { id: 'admin', label: 'المسؤولين' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            لم يتم العثور على أي مستخدمين يطابقون البحث.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-extrabold">
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">البريد الإلكتروني</th>
                  <th className="py-3 px-4">الرتبة</th>
                  <th className="py-3 px-4">حالة الحساب</th>
                  <th className="py-3 px-4">تاريخ التسجيل</th>
                  <th className="py-3 px-4">آخر دخول</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                {filteredUsers.map(u => {
                  const isCurrentAdmin = u.email.toLowerCase() === 'benauf7@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 ${
                          isCurrentAdmin 
                            ? 'bg-gradient-to-tr from-amber-500 to-rose-500' 
                            : 'bg-gradient-to-tr from-indigo-600 to-emerald-500'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">ID: {u.id.slice(0, 12)}...</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {u.email}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        {isCurrentAdmin || u.role === 'admin' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center gap-1 w-max">
                            <ShieldCheck className="w-3 h-3" />
                            <span>مدير النظام</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-max block">
                            طالب
                          </span>
                        )}
                      </td>

                      {/* Verification Status + Toggle Button */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleVerification(u)}
                          title="اضغط لتغيير حالة الحساب يدوياً"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                            u.isVerified
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100'
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>مفعل ومؤكد</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>قيد التأكيد (اضغط للتفعيل)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('ar-EG', { dateStyle: 'medium' }) : 'لم يسجل دخول'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        {isCurrentAdmin ? (
                          <span className="text-[10px] text-slate-400 font-bold">محمي</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            title="حذف الحساب نهائياً"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-500" />
                <span>إضافة حساب طالب جديد يدوياً</span>
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setFormMsg(null); }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formMsg && (
              <div className={`p-3 rounded-2xl text-xs font-bold ${
                formMsg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200'
              }`}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: يوسف أحمد"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="student@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور (6 خانات على الأقل)
                </label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'إنشاء وتأكيد الحساب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
