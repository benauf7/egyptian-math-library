import React, { useState, useMemo } from 'react';
import { ALL_FORMULAS } from '../data/formulas';
import { GRADES_DATA } from '../data/curriculum/grades';
import { MathFormula, StageId, GradeId, AcademicYear } from '../data/types';
import { MathView } from '../utils/katex-render';
import { 
  Calculator, 
  Filter, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useUserStorage } from '../utils/storage';

interface FormulasListProps {
  searchQuery: string;
  onSelectFormula: (id: string) => void;
  onShowSource: (formula: MathFormula) => void;
  initialGradeId?: string;
}

export const FormulasList: React.FC<FormulasListProps> = ({
  searchQuery,
  onSelectFormula,
  onShowSource,
  initialGradeId
}) => {
  const { isFav, isRev, toggleFav, toggleRev } = useUserStorage();
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGradeId || 'all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [onlyFactoring, setOnlyFactoring] = useState<boolean>(false);
  const [onlyExtra, setOnlyExtra] = useState<boolean>(false);

  // Sync initialGradeId if changed
  React.useEffect(() => {
    if (initialGradeId) {
      setSelectedGrade(initialGradeId);
    }
  }, [initialGradeId]);

  const filteredFormulas = useMemo(() => {
    return ALL_FORMULAS.filter((f) => {
      // Stage filter
      if (selectedStage !== 'all' && f.stage_id !== selectedStage) return false;
      // Grade filter
      if (selectedGrade !== 'all' && f.grade_id !== selectedGrade) return false;
      // Year filter
      if (selectedYear !== 'all' && f.academic_year !== selectedYear) return false;
      // Factoring filter
      if (onlyFactoring && !f.is_factoring) return false;
      // Extra filter
      if (onlyExtra && !f.is_extra_curricular) return false;

      // Search query filter (matches Arabic, English, latex, topic, meaning)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = f.name.toLowerCase().includes(q);
        const matchNameEn = f.name_en?.toLowerCase().includes(q) || false;
        const matchLatex = f.latex.toLowerCase().includes(q);
        const matchTopic = f.topic.toLowerCase().includes(q);
        const matchBranch = f.branch.toLowerCase().includes(q);
        const matchMeaning = f.meaning_explanation.toLowerCase().includes(q);
        const matchSymbols = f.symbol_definitions.some(s => s.meaning.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q));

        if (!matchName && !matchNameEn && !matchLatex && !matchTopic && !matchBranch && !matchMeaning && !matchSymbols) {
          return false;
        }
      }

      return true;
    });
  }, [selectedStage, selectedGrade, selectedYear, onlyFactoring, onlyExtra, searchQuery]);

  const stages = [
    { id: 'all', label: 'جميع المراحل' },
    { id: 'primary', label: 'المرحلة الابتدائية' },
    { id: 'prep', label: 'المرحلة الإعدادية' },
    { id: 'secondary', label: 'المرحلة الثانوية (بكالوريا)' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-500" />
            <span>مكتبة القوانين الرياضية</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            جميع القوانين مصنفة حسب الصف، السنة، الوحدة، وموثقة بالمصدر الرسمي
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          عرض <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredFormulas.length}</span> قانون
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>الفلاتر الأكاديمية للمناهج</span>
        </div>

        {/* Stage Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setSelectedStage(st.id);
                if (st.id !== 'all' && selectedGrade !== 'all') {
                  const g = GRADES_DATA.find(x => x.id === selectedGrade);
                  if (g && g.stage !== st.id) setSelectedGrade('all');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStage === st.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Grade Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              selectedGrade === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            كل الصفوف
          </button>
          {GRADES_DATA.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGrade(g.id);
                setSelectedStage(g.stage);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedGrade === g.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {g.name} ({g.academic_year})
            </button>
          ))}
        </div>

        {/* Specialized Flags */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyFactoring}
              onChange={(e) => setOnlyFactoring(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>قوانين التحليل الرياضي فقط</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyExtra}
              onChange={(e) => setOnlyExtra(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>إضافات خارج المنهج فقط</span>
          </label>

          {(selectedStage !== 'all' || selectedGrade !== 'all' || selectedYear !== 'all' || onlyFactoring || onlyExtra) && (
            <button
              onClick={() => {
                setSelectedStage('all');
                setSelectedGrade('all');
                setSelectedYear('all');
                setOnlyFactoring(false);
                setOnlyExtra(false);
              }}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline mr-auto"
            >
              إلغاء الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Formulas Grid */}
      {filteredFormulas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">لم يتم العثور على أي قانون</h3>
          <p className="text-xs text-slate-400">جرب تغيير كلمات البحث أو إعادة ضبط الفلاتر المحددة.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFormulas.map((formula) => {
            const fav = isFav(formula.id);
            const reviewed = isRev(formula.id);

            return (
              <div
                key={formula.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {formula.grade_name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {formula.academic_year}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFav(formula.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          fav ? 'bg-amber-500 text-white border-amber-600' : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                        }`}
                        title="المفضلة"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRev(formula.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          reviewed ? 'bg-emerald-600 text-white border-emerald-700' : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-emerald-500'
                        }`}
                        title="تمت المراجعة"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Topic */}
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {formula.topic} • {formula.branch}
                    </span>
                    <h3 
                      onClick={() => onSelectFormula(formula.id)}
                      className="text-base font-black text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {formula.name}
                    </h3>
                    {formula.name_en && (
                      <p className="text-[11px] text-slate-400 font-mono" dir="ltr">{formula.name_en}</p>
                    )}
                  </div>

                  {/* KaTeX Math View Box */}
                  <div 
                    onClick={() => onSelectFormula(formula.id)}
                    className="p-4 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center cursor-pointer group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-colors"
                  >
                    <MathView math={formula.latex} block={true} />
                  </div>

                  {/* Meaning excerpt */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {formula.meaning_explanation}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onShowSource(formula)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>المصدر الرسمي</span>
                  </button>

                  <button
                    onClick={() => onSelectFormula(formula.id)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>الشرح الكامل</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
