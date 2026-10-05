import React, { useState } from 'react';
import { GRADES_DATA } from '../data/curriculum/grades';
import { ALL_FORMULAS, getFormulasByYear } from '../data/formulas';
import { ALL_LESSONS, getLessonsByYear } from '../data/lessons';
import { SOLUTION_METHODS } from '../data/methods';
import { FACTORING_METHODS } from '../data/factoring';
import { MathView } from '../utils/katex-render';
import { 
  Calendar, 
  BookOpen, 
  Calculator, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { AcademicYear } from '../data/types';

interface TimelineViewProps {
  onSelectFormula: (id: string) => void;
  onSelectLesson: (id: string) => void;
  onShowSource: (item: any) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onSelectFormula,
  onSelectLesson,
  onShowSource
}) => {
  const [selectedYear, setSelectedYear] = useState<AcademicYear>('2026/2027');

  const selectedGrade = GRADES_DATA.find(g => g.academic_year === selectedYear);
  const yearFormulas = getFormulasByYear(selectedYear);
  const yearLessons = getLessonsByYear(selectedYear);
  const yearMethods = SOLUTION_METHODS.filter(m => m.academic_year === selectedYear);
  const yearFactoring = FACTORING_METHODS.filter(f => f.academic_year === selectedYear);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          <Calendar className="w-3.5 h-3.5" />
          <span>مسار السنوات الدراسية الرسمية (2020 - 2027)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          رحلتي في الرياضيات
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          خط زمني تفاعلي يوثق المناهج التي درستها عبر 7 سنوات متتالية. اضغط على أي عام دراسي لعرض جميع القوانين والموضوعات المنتمية له حصراً.
        </p>
      </div>

      {/* Interactive Horizontal Timeline Bar */}
      <div className="relative overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="text-[10px] text-slate-400 font-bold mb-1 sm:hidden flex items-center justify-center gap-1">
          <span>⟵ اسحب أفقياً لتصفح جميع السنوات الدراسية ⟶</span>
        </div>
        <div className="flex items-center justify-between min-w-[700px] px-4 relative">
          
          {/* Timeline track line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {GRADES_DATA.map((item, idx) => {
            const isSelected = selectedYear === item.academic_year;
            const isCurrent = item.is_current_year;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedYear(item.academic_year)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Year Marker Circle */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'bg-indigo-600 text-white scale-110 ring-4 ring-indigo-200 dark:ring-indigo-900 shadow-indigo-500/30'
                      : isCurrent
                      ? 'bg-emerald-600 text-white hover:scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span className="font-mono">{idx + 4}</span>
                </div>

                {/* Academic Year Label */}
                <span className={`text-[11px] font-bold mt-2 font-mono transition-colors ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {item.academic_year}
                </span>

                {/* Grade Label */}
                <span className={`text-[10px] text-center max-w-[90px] font-semibold mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {item.name.replace('الصف ', '')}
                </span>

                {isCurrent && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mt-1">
                    الحالي
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Year Detail Panel */}
      {selectedGrade && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          
          {/* Header of Selected Year */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  العام الدراسي: {selectedGrade.academic_year}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedGrade.curriculum_name}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedGrade.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {selectedGrade.description}
              </p>
            </div>

            <button
              onClick={() => onShowSource({
                source_title: selectedGrade.official_book,
                academic_year: selectedGrade.academic_year,
                grade: selectedGrade.name,
                curriculum_version: selectedGrade.curriculum_version,
                official_publisher: 'وزارة التربية والتعليم والتعليم الفني - مصر',
                notes: selectedGrade.curriculum_name
              })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>توثيق كتاب الوزارة لهذا العام</span>
            </button>
          </div>

          {/* Formulas of Selected Year */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-500" />
                <span>قوانين هذا العام ({yearFormulas.length})</span>
              </h3>
            </div>

            {yearFormulas.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد قوانين مسجلة منفصلة لهذا العام في هذا القسم.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {yearFormulas.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onSelectFormula(f.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{f.topic}</span>
                        <span>{f.branch}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">{f.name}</h4>
                      <div className="text-center py-2 text-slate-800 dark:text-slate-100">
                        <MathView math={f.latex} block={false} />
                      </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <span>عرض الشرح والخطوات</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lessons of Selected Year */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>دروس المنهج الموثقة ({yearLessons.length})</span>
              </h3>
            </div>

            {yearLessons.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد دروس إضافية مسجلة لهذا العام.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {yearLessons.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onSelectLesson(l.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {l.unit_name}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 mb-1">{l.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {l.key_concepts.join(' • ')}
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span>فتح تفاصيل الدرس الـ 20 نقطة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Factoring or Solution Methods for this year */}
          {(yearFactoring.length > 0 || yearMethods.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {yearFactoring.length > 0 && (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    طرق التحليل التي تعلمتها في هذا الصف ({yearFactoring.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-purple-950 dark:text-purple-200">
                    {yearFactoring.map(f => (
                      <li key={f.id} className="font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {yearMethods.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    طرق الحل المرتبطة بهذا الصف ({yearMethods.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                    {yearMethods.map(m => (
                      <li key={m.id} className="font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{m.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
