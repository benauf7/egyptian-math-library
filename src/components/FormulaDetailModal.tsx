import React from 'react';
import { MathFormula } from '../data/types';
import { MathView } from '../utils/katex-render';
import { 
  X, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeftRight,
  BookOpen
} from 'lucide-react';
import { useUserStorage } from '../utils/storage';

interface FormulaDetailModalProps {
  formula: MathFormula | null;
  onClose: () => void;
  onShowSource: (formula: MathFormula) => void;
  onUpdateState?: () => void;
}

export const FormulaDetailModal: React.FC<FormulaDetailModalProps> = ({
  formula,
  onClose,
  onShowSource,
  onUpdateState
}) => {
  const { isFav, isRev, toggleFav, toggleRev } = useUserStorage();

  if (!formula) return null;

  const fav = isFav(formula.id);
  const reviewed = isRev(formula.id);

  const handleToggleFav = () => {
    toggleFav(formula.id);
    onUpdateState?.();
  };

  const handleToggleReviewed = () => {
    toggleRev(formula.id);
    onUpdateState?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/60 dark:to-indigo-950/20">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {formula.grade_name}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {formula.academic_year}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {formula.branch}
              </span>
              {formula.is_extra_curricular && (
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                  إضافات خارج المنهج
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {formula.name}
            </h2>
            {formula.name_en && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                {formula.name_en}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleFav}
              title={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              className={`p-2 rounded-xl border transition-colors ${
                fav 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/30' 
                  : 'text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleToggleReviewed}
              title={reviewed ? 'تمت مراجعته' : 'تحديد كمراجع'}
              className={`p-2 rounded-xl border transition-colors ${
                reviewed 
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm shadow-emerald-600/30' 
                  : 'text-slate-400 hover:text-emerald-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Equation Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-emerald-50/40 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-indigo-950/30 border border-indigo-100 dark:border-slate-700 text-center shadow-inner">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              الصيغة الرياضية المعتمدة
            </span>
            <div className="text-xl sm:text-2xl text-slate-900 dark:text-white font-bold py-2 overflow-x-auto">
              <MathView math={formula.latex} block={true} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed text-right">
              {formula.meaning_explanation}
            </p>
          </div>

          {/* Symbol Definitions */}
          {formula.symbol_definitions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                شرح الرموز والمصطلحات
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {formula.symbol_definitions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900">
                      {item.symbol}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* When to use */}
          {formula.when_to_use.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                متى أستخدم هذا القانون؟
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {formula.when_to_use.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Steps */}
          {formula.solution_steps.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                خطوات التطبيق والحل
              </h3>
              <div className="space-y-2">
                {formula.solution_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solved Example */}
          {formula.example && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
                مثال توضيحي محلول خطوة بخطوة
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 leading-relaxed">
                {formula.example.problem}
              </p>
              <div className="space-y-1.5 border-r-2 border-emerald-500 pr-3 my-2 text-xs text-slate-600 dark:text-slate-300 font-mono" dir="ltr">
                {formula.example.solution_steps.map((s, idx) => (
                  <p key={idx} className="text-right font-sans">{s}</p>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">الناتج النهائي:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formula.example.answer}</span>
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {formula.common_mistakes && formula.common_mistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
              <h3 className="font-bold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                أخطاء شائعة يجب تجنبها
              </h3>
              <ul className="space-y-1 text-rose-700 dark:text-rose-300/90 list-disc list-inside">
                {formula.common_mistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {formula.notes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">ملاحظات هامة:</span>
              <ul className="space-y-1 text-amber-800 dark:text-amber-300/80 list-disc list-inside">
                {formula.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onShowSource(formula)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>عرض المصدر الرسمي لكتاب الوزارة</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
