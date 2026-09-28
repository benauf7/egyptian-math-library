import React from 'react';
import { SourceReference } from '../data/types';
import { ShieldCheck, ExternalLink, X, BookOpen, Calendar, Building, Info } from 'lucide-react';

interface SourceModalProps {
  source: SourceReference | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">توثيق المصدر والمنهج الرسمي</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">توثيق وزارة التربية والتعليم المصرية</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              عنوان المرجع / الكتاب
            </h4>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
              {source.source_title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                العام الدراسي المعتمد
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {source.academic_year}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5 text-purple-500" />
                الصف الدراسي
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {source.grade}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
            <div className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" />
              الجهة المصدرة وإصدار المنهاج
            </div>
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
              {source.official_publisher}
            </p>
            {source.notes && (
              <p className="mt-2 text-indigo-600 dark:text-indigo-400 italic">
                ملاحظة التوثيق: {source.notes}
              </p>
            )}
          </div>

          {source.source_url && (
            <a
              href={source.source_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <span>زيارة بوابة التعليم الإلكتروني بالوزارة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
