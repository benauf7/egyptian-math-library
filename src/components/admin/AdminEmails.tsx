import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  KeyRound, 
  Send,
  AlertCircle
} from 'lucide-react';
import { SentEmail } from '../../utils/auth-db';

interface AdminEmailsProps {
  emails: SentEmail[];
  onRefreshEmails: () => void;
}

export const AdminEmails: React.FC<AdminEmailsProps> = ({
  emails,
  onRefreshEmails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<'all' | 'verification' | 'password_reset'>('all');

  const filtered = emails.filter(e => {
    const matchesSearch = 
      e.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterPurpose !== 'all' && e.purpose !== filterPurpose) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-amber-500" />
            <span>سجل رسائل وأكواد التحقق المرسلة ({emails.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            مراقبة أكواد التأكيد (6 خانات) ورسائل استعادة كلمة المرور وحالة إرسالها الفعلية
          </p>
        </div>

        <button
          onClick={onRefreshEmails}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث بالبريد، اسم الطالب، أو الرمز (6 خانات)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `الكل (${emails.length})` },
            { id: 'verification', label: 'تأكيد الحساب' },
            { id: 'password_reset', label: 'استعادة المرور' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterPurpose(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterPurpose === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emails Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            لا توجد أي رسائل بريد مطابقة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 font-extrabold">
                  <th className="py-3 px-4">المستلم</th>
                  <th className="py-3 px-4">الغرض</th>
                  <th className="py-3 px-4 text-center">رمز التأكيد (6 خانات)</th>
                  <th className="py-3 px-4">حالة الإرسال الفعلي</th>
                  <th className="py-3 px-4">وقت الإرسال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                {filtered.map(email => (
                  <tr key={email.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Recipient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{email.recipientName}</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{email.to}</span>
                    </td>

                    {/* Purpose */}
                    <td className="py-3.5 px-4">
                      {email.purpose === 'verification' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          تأكيد إنشاء حساب
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          استعادة كلمة مرور
                        </span>
                      )}
                    </td>

                    {/* Security Code */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-black text-sm tracking-widest text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                        {email.code}
                      </span>
                    </td>

                    {/* Delivery Mode */}
                    <td className="py-3.5 px-4">
                      {email.deliveredToRealInbox ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم الإرسال لبريد المستخدم الحقيقي</span>
                        </span>
                      ) : email.previewUrl ? (
                        <a
                          href={email.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                        >
                          <span>معاينة الرسالة (Ethereal)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>صندوق المحاكي الداخلي</span>
                        </span>
                      )}
                    </td>

                    {/* Sent Time */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                      {new Date(email.sentAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
