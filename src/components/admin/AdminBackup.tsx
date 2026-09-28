import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { User, getAllUsers, saveUser } from '../../utils/auth-db';
import { 
  getCustomFormulas, 
  getDeletedFormulaIds, 
  getOverriddenFormulas,
  saveFormula,
  resetFormulasToDefault
} from '../../utils/custom-laws-db';

interface AdminBackupProps {
  onRefreshAll: () => void;
}

export const AdminBackup: React.FC<AdminBackupProps> = ({ onRefreshAll }) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Export full JSON backup
  const handleExportBackup = async () => {
    try {
      const users = await getAllUsers();
      const customFormulas = getCustomFormulas();
      const deletedIds = getDeletedFormulaIds();
      const overrides = getOverriddenFormulas();

      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        platform: 'Egyptian Math Archive Admin',
        users,
        customFormulas,
        deletedIds,
        overrides
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `egyptian_math_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMsg({ type: 'success', text: 'تم تصدير النسخة الاحتياطية بنجاح إلى ملف JSON.' });
    } catch {
      setStatusMsg({ type: 'error', text: 'حدث خطأ أثناء تصدير النسخة الاحتياطية.' });
    }
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (data.users && Array.isArray(data.users)) {
          for (const u of data.users) {
            await saveUser(u);
          }
        }

        if (data.customFormulas && Array.isArray(data.customFormulas)) {
          for (const f of data.customFormulas) {
            saveFormula(f);
          }
        }

        onRefreshAll();
        setStatusMsg({ type: 'success', text: `تم استعادة النسخة الاحتياطية بنجاح! تم استيراد ${data.users?.length || 0} مستخدم و ${data.customFormulas?.length || 0} قانون.` });
      } catch {
        setStatusMsg({ type: 'error', text: 'ملف النسخة الاحتياطية غير صالح أو تالف.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Database className="w-6 h-6 text-purple-500" />
          <span>النسخ الاحتياطي وإدارة البيانات</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          تصدير قاعدة بيانات الحسابات والقوانين المضافة إلى ملفات JSON واستعادتها في أي وقت
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-3xl border flex items-center gap-3 text-xs ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          <p className="font-bold">{statusMsg.text}</p>
        </div>
      )}

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Export Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              تصدير نسخة احتياطية شاملة (Export JSON)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تحميل ملف بصيغة JSON يشمل جميع الحسابات المسجلة، والقوانين المخصصة، وحالات التفعيل لحفظها بأمان على جهازك.
            </p>
          </div>

          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل النسخة الاحتياطية الآن</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              استعادة من ملف نسخة احتياطية (Import JSON)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              رفع ملف JSON تم تصديره سابقاً لدمجه واستعادة حسابات الطلاب والقوانين المسجلة.
            </p>
          </div>

          <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>اختيار ملف JSON للاستعادة</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

      </div>

    </div>
  );
};
