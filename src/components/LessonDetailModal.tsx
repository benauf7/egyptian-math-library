import React from 'react';
import { MathLesson } from '../data/types';
import { MathView } from '../utils/katex-render';
import { 
  X, 
  Bookmark, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUserStorage } from '../utils/storage';
import { getFormulaById } from '../data/formulas';

interface LessonDetailModalProps {
  lesson: MathLesson | null;
  onClose: () => void;
  onShowSource: (lesson: MathLesson) => void;
  onSelectFormula?: (formulaId: string) => void;
  onUpdateState?: () => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  onClose,
  onShowSource,
  onSelectFormula,
  onUpdateState
}) => {
  const { isFav, isRev, toggleFav, toggleRev } = useUserStorage();

  if (!lesson) return null;

  const fav = isFav(lesson.id);
  const reviewed = isRev(lesson.id);

  const handleToggleFav = () => {
    toggleFav(lesson.id);
    onUpdateState?.();
  };

  const handleToggleReviewed = () => {
    toggleRev(lesson.id);
    onUpdateState?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-emerald-50/50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-indigo-950/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {lesson.grade_name}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  العام الدراسي: {lesson.academic_year}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {lesson.unit_name}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  فرع: {lesson.branch}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {lesson.title}
              </h2>
              {lesson.title_en && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                  {lesson.title_en}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleToggleFav}
                title={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                className={`p-2 rounded-xl border transition-colors ${
                  fav 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleToggleReviewed}
                title={reviewed ? 'تمت المراجعة' : 'تحديد كمراجع'}
                className={`p-2 rounded-xl border transition-colors ${
                  reviewed 
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                    : 'text-slate-400 hover:text-emerald-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-7 max-h-[75vh] overflow-y-auto">

          {/* 5. Key Concepts */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              5. المفاهيم الأساسية للدرس
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {lesson.key_concepts.map((concept, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="text-slate-800 dark:text-slate-200">{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Definitions */}
          {lesson.definitions.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                6. التعريفات الرياضية الدقيقة
              </h3>
              <div className="space-y-2">
                {lesson.definitions.map((def, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{def.term}</span>
                      {def.term_en && (
                        <span className="text-[11px] text-slate-400 font-mono" dir="ltr">({def.term_en})</span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7 & 8 & 9. Formulas, Symbols & Explanation */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              7 & 8 & 9. القوانين والرموز وشرح الصيغة
            </h3>
            
            {/* Associated Formulas */}
            {lesson.formula_ids.length > 0 && (
              <div className="space-y-3 mb-4">
                {lesson.formula_ids.map((fid) => {
                  const formulaObj = getFormulaById(fid);
                  if (!formulaObj) return null;
                  return (
                    <div 
                      key={fid} 
                      onClick={() => onSelectFormula?.(fid)}
                      className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 hover:border-indigo-400 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          {formulaObj.name}
                        </span>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>عرض بطاقة القانون</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="text-center py-2 text-slate-900 dark:text-white font-bold">
                        <MathView math={formulaObj.latex} block={true} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">شرح القوانين:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lesson.formula_explanation}
              </p>
            </div>
          </div>

          {/* 10. When to use & 11. Solution Steps */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 text-xs">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                10. متى أستخدم القانون؟
              </h4>
              <ul className="space-y-1.5 text-emerald-800 dark:text-emerald-300/90">
                {lesson.when_to_use.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/50 text-xs">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                11. خطوات الحل المنهجية
              </h4>
              <div className="space-y-1.5">
                {lesson.solution_steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-indigo-950 dark:text-indigo-200 leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 12, 13, 14, 15. The 4 Graded Solved Examples */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              12 - 15. الأمثلة المحلولة التدرجية (بسيط، متوسط، متقدم، تطبيقي)
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {lesson.examples.map((ex, idx) => {
                const levelColors = {
                  'بسيط': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
                  'متوسط': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
                  'متقدم': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
                  'تطبيقي': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                };
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${levelColors[ex.level]}`}>
                          مثال {ex.level}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ex.title}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 leading-relaxed">
                        {ex.question}
                      </p>
                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-sans border-r-2 border-slate-300 dark:border-slate-700 pr-2 my-2">
                        {ex.solution_steps.map((step, sIdx) => (
                          <p key={sIdx} className="leading-relaxed">{step}</p>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                      <span>الناتج:</span>
                      <span className="font-bold">{ex.final_answer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 16. Common Mistakes */}
          {lesson.common_mistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
              <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                16. الأخطاء الشائعة وطرق تفاديها
              </h4>
              <div className="space-y-2">
                {lesson.common_mistakes.map((cm, idx) => {
                  const isObj = typeof cm !== 'string';
                  const mistake = isObj ? cm.mistake : cm;
                  const explanation = isObj ? cm.correct_explanation : '';
                  return (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/70 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900">
                      <p className="font-bold text-rose-800 dark:text-rose-300 mb-1">❌ الخطأ: {mistake}</p>
                      {explanation && <p className="text-slate-700 dark:text-slate-300">✅ التصحيح: {explanation}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 17. Shortcuts and Tricks */}
          {lesson.shortcuts_and_tricks && lesson.shortcuts_and_tricks.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                17. اختصارات وحيل رياضية ذكية
              </h4>
              <ul className="space-y-1 text-amber-800 dark:text-amber-300/90 list-disc list-inside">
                {lesson.shortcuts_and_tricks.map((trick, idx) => (
                  <li key={idx}>{trick}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* 20. Source & Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onShowSource(lesson)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>20. المصدر: {lesson.source.source_title}</span>
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
