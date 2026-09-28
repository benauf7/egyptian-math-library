import React, { useState } from 'react';
import { MATH_FOUNDATIONS, MathFoundationItem } from '../data/foundations';
import { 
  Compass, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
  ShieldAlert
} from 'lucide-react';

export const FoundationsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'جميع الأساسيات' },
    { id: 'تريكات وشواذ', label: '⚡ التريكات والحالات الشاذة' },
    { id: 'إشارات', label: 'قواعد الإشارات' },
    { id: 'عمليات', label: 'ترتيب العمليات والكسور' },
    { id: 'أعداد', label: 'مجموعات الأعداد' },
    { id: 'تحويلات', label: 'تحويلات الوحدات' },
  ];

  const filteredItems = MATH_FOUNDATIONS.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
          <Zap className="w-3.5 h-3.5" />
          <span>قسم التأسيس الرياضي والتريكات الشائعة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          أساسيات الرياضيات والحالات الشاذة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          القواعد الذهبية، إشارات العمليات، الأولويات الحسابية، وأهم المطبات والتريكات التي يعتمد عليها واضعو الامتحانات.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="space-y-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2 inline-block">
                  {item.category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-xs font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{item.golden_rule}</span>
              </div>
            </div>

            {/* Rules and Examples */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                القواعد التوضيحية والأمثلة بالأرقام
              </span>
              <div className="grid gap-3">
                {item.rules.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900 dark:text-white leading-relaxed">
                      {r.rule}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-indigo-700 dark:text-indigo-300 text-xs">
                      {r.example}
                    </div>
                    {r.note && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {r.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Pitfalls */}
            {item.critical_pitfalls.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs space-y-2">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>المطبات الشائعة في الامتحانات (احذر الوقوع فيها):</span>
                </h4>
                <ul className="space-y-1 text-rose-800 dark:text-rose-300/90 list-disc list-inside">
                  {item.critical_pitfalls.map((pit, pIdx) => (
                    <li key={pIdx} className="leading-relaxed">{pit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
