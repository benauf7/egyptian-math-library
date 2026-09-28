import React, { useState } from 'react';
import { SOLUTION_METHODS } from '../data/methods';
import { SolutionMethod } from '../data/types';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface MethodsViewProps {
  onShowSource: (method: SolutionMethod) => void;
}

export const MethodsView: React.FC<MethodsViewProps> = ({ onShowSource }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'جميع التصنيفات' },
    { id: 'معادلات', label: 'المعادلات والنظم' },
    { id: 'مسائل لفظية', label: 'المسائل اللفظية' },
    { id: 'نسب وتناسب', label: 'النسب والتناسب' },
    { id: 'تبسيط', label: 'التبسيط والاختزال' },
    { id: 'هندسة', label: 'البراهين الهندسية' },
    { id: 'دوال', label: 'الدوال والمتباينات' },
  ];

  const filteredMethods = SOLUTION_METHODS.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>خوارزميات وطرق حل المسائل</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مناهج وخطوات التفكير وحل التمارين الرياضية الصعبة عبر السنوات المدرسية
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          عرض <span className="font-bold text-amber-600 dark:text-amber-400">{filteredMethods.length}</span> طريقة
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Methods Cards */}
      <div className="space-y-6">
        {filteredMethods.map((method) => (
          <div
            key={method.id}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    تصنيف: {method.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {method.grade_name} ({method.academic_year})
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {method.name}
                </h3>
                {method.name_en && (
                  <p className="text-[11px] text-slate-400 font-mono" dir="ltr">{method.name_en}</p>
                )}
              </div>

              <button
                onClick={() => onShowSource(method)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>المصدر: {method.source.grade}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {method.description}
            </p>

            {/* Steps */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                الخطوات المنهجية المتبعة
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {method.steps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {method.examples.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">{ex.title}:</span>
                <p className="font-bold text-slate-900 dark:text-white leading-relaxed">{ex.problem}</p>
                <div className="space-y-1 text-slate-600 dark:text-slate-300 border-r-2 border-amber-500 pr-2 pt-1 font-sans">
                  {ex.solution.map((step, sIdx) => (
                    <p key={sIdx} className="leading-relaxed">{step}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Pro tips */}
            {method.pro_tips && method.pro_tips.length > 0 && (
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs flex items-start gap-2 text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">نصيحة وخبرة رياضية:</span>
                  <p>{method.pro_tips.join(' ')}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
