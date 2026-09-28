import React, { useState } from 'react';
import { FACTORING_METHODS } from '../data/factoring';
import { FactoringMethod } from '../data/types';
import { MathView } from '../utils/katex-render';
import { 
  Layers, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

interface FactoringMasteryProps {
  onShowSource: (method: FactoringMethod) => void;
}

export const FactoringMastery: React.FC<FactoringMasteryProps> = ({ onShowSource }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(FACTORING_METHODS[0].id);

  const currentMethod = FACTORING_METHODS.find(m => m.id === selectedMethodId) || FACTORING_METHODS[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
          <Layers className="w-3.5 h-3.5" />
          <span>منظومة التحليل الجبري الشاملة (المنهج المصري القديم)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          أركان التحليل الرياضي
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          دليل عملي تفاعلي لجميع أنواع التحليل الجبري المقررة في المنهج الذي درسته (الصف الأول والثاني الإعدادي 2023 - 2025)، بكافة خوارزميات التعرف والخطوات والأمثلة النموذجية.
        </p>
      </div>

      {/* Main Interactive Factoring Explorer: Side Navigation + Content Card */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 px-3 py-1 block">
              طرق التحليل المقررة في منهجي ({FACTORING_METHODS.length})
            </span>
            {FACTORING_METHODS.map((method, idx) => {
              const isActive = method.id === currentMethod.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`w-full text-right p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate">{method.name}</span>
                  </div>
                  <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Helper Tip */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">💡 القاعدة الذهبية الأولى:</span>
            <p className="text-amber-800 dark:text-amber-300/80 leading-relaxed">
              قبل البدء في أي تحليل (مقص، فرق مربعين، مكعبين، أو تقسيم)، تأكد دائماً من فحص وإخراج العامل المشترك الأكبر (ع.م.أ) أولاً!
            </p>
          </div>
        </div>

        {/* Selected Factoring Method Master View */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Header of Method */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {currentMethod.academic_year}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  منهج مصر القديم
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentMethod.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">{currentMethod.name_en}</p>
            </div>

            <button
              onClick={() => onShowSource(currentMethod)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>المصدر الرسمي</span>
            </button>
          </div>

          {/* Formula Representation */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/40 dark:from-slate-800/80 dark:to-purple-950/20 border border-purple-100 dark:border-slate-700 text-center">
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1.5">
              الصيغة الجبرية للتحليل
            </span>
            <div className="text-lg sm:text-xl text-slate-900 dark:text-white font-bold py-1">
              <MathView math={currentMethod.algebraic_form} block={true} />
            </div>
          </div>

          {/* How to Recognize */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
              كيف أتعرف على هذا النوع من المسألة؟
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {currentMethod.how_to_recognize.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Procedure */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              خوارزمية وخطوات الحل
            </h3>
            <div className="space-y-2">
              {currentMethod.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solved Examples */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              أمثلة توضيحية محلولة بالتفصيل
            </h3>
            <div className="space-y-3">
              {currentMethod.solved_examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-600 dark:text-purple-400">مثال {idx + 1}:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">{ex.expression}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 border-r-2 border-purple-400 pr-2">
                    {ex.steps.map((step, sIdx) => (
                      <p key={sIdx}>{step}</p>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>الناتج التحليلي النهائي:</span>
                    <span dir="ltr" className="font-mono">{ex.factored}</span>
                  </div>
                  {ex.note && (
                    <p className="text-[11px] text-slate-500 italic mt-1">{ex.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Common Pitfalls */}
          {currentMethod.common_pitfalls.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
              <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                أخطاء شائعة احذر الوقوع فيها أثناء التحليل
              </h4>
              <ul className="space-y-1.5 text-rose-800 dark:text-rose-300/90 list-disc list-inside">
                {currentMethod.common_pitfalls.map((pit, idx) => (
                  <li key={idx}>{pit}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
