import { 
  Calculator, 
  BookOpen, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  GraduationCap, 
  History, 
  Star, 
  Printer,
  Zap
} from 'lucide-react';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { FACTORING_METHODS } from '../data/factoring';
import { SOLUTION_METHODS } from '../data/methods';
import { GRADES_DATA } from '../data/curriculum/grades';
import { getRecentItems, getNeedsReview, getReviewed, getFavorites } from '../utils/storage';
import { NavTab } from './Sidebar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onSelectGrade: (gradeId: string) => void;
  onSelectFormula: (formulaId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectGrade,
  onSelectFormula,
  onSelectLesson
}) => {
  const recentItems = getRecentItems();
  const needsReviewList = getNeedsReview();
  const reviewedCount = getReviewed().length;
  const favCount = getFavorites().length;

  const currentYearGrade = GRADES_DATA.find(g => g.is_current_year);

  const stats = [
    { label: 'إجمالي القوانين', count: ALL_FORMULAS.length, icon: Calculator, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' },
    { label: 'الدروس الموثقة', count: ALL_LESSONS.length, icon: BookOpen, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'طرق التحليل الرياضي', count: FACTORING_METHODS.length, icon: Layers, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
    { label: 'طرق حل المسائل', count: SOLUTION_METHODS.length, icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    { label: 'الصفوف الموثقة', count: GRADES_DATA.length, icon: GraduationCap, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60' },
    { label: 'السنوات الدراسية', count: '7 سنوات', icon: Calendar, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner with Official Year Focus */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>السنة الدراسية الحالية: 2026/2027 (أولى بكالوريا)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            مكتبة الرياضيات الشخصية
            <span className="block text-indigo-300 text-lg sm:text-2xl font-bold mt-1">
              أرشيف رحلتي في المناهج المصرية الرسمية (2020 - 2027)
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            توثيق دقيق وشامل لجميع القوانين، التعريفات، طرق التحليل، خطوات حل المسائل، والأخطاء الشائعة للمنهج المصري القديم (آخر دفعة درست المناهج القديمة قبل منظومة 2.0)، وصولاً إلى منهج أولى بكالوريا المحدث للعام الحالي 2026/2027.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('foundations')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>الأساسيات والتريكات الشائعة</span>
            </button>

            <button
              onClick={() => onNavigate('timeline')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>رحلتي في الرياضيات (Timeline)</span>
            </button>

            <button
              onClick={() => onNavigate('factoring')}
              className="px-5 py-2.5 rounded-xl bg-indigo-700/70 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-500/50 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-purple-300" />
              <span>التحليل الرياضي</span>
            </button>

            <button
              onClick={() => onNavigate('print')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700/70 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-500/50 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>كتاب PDF</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute left-0 bottom-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
                  {s.count}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Progress Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              مؤشر التقدم في المراجعة الشخصية
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">
              تمت مراجعة {reviewedCount} عنصر
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              {favCount} في المفضلة
            </span>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((reviewedCount / (ALL_FORMULAS.length + ALL_LESSONS.length)) * 100))}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Recent Items & Needs Review */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recently Reviewed Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" />
                آخر ما راجعته
              </h3>
              <button
                onClick={() => onNavigate('favorites')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                عرض الكل
              </button>
            </div>

            {recentItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لم تقم بفتح أو مراجعة أي عناصر بعد. تصفح القوانين والدروس وسيتم حفظ مسارك تلقائياً!
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'formula') onSelectFormula(item.id);
                      else if (item.type === 'lesson') onSelectLesson(item.id);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 cursor-pointer border border-slate-200/60 dark:border-slate-800 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.grade_name} • {item.academic_year}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {item.type === 'formula' ? 'قانون' : item.type === 'lesson' ? 'درس' : 'طريقة حل'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Items Needing Review */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                الموضوعات التي تحتاج مراجعة
              </h3>
              <button
                onClick={() => onNavigate('favorites')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                قائمة المراجعة
              </button>
            </div>

            {needsReviewList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                رائع! لا توجد موضوعات محددة تحتاج مراجعة عاجلة حالياً.
              </div>
            ) : (
              <div className="space-y-2.5">
                {needsReviewList.slice(0, 4).map((id) => {
                  const formula = ALL_FORMULAS.find(f => f.id === id);
                  const lesson = ALL_LESSONS.find(l => l.id === id);
                  const title = formula?.name || lesson?.title || id;
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        if (formula) onSelectFormula(formula.id);
                        else if (lesson) onSelectLesson(lesson.id);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 border border-amber-200 dark:border-amber-900/40 cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">بحاجة للمراجعة</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grade Exploration Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تصفح المحتوى حسب الصفوف والمناهج الدراسية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جميع الصفوف موثقة بالسنة الفعلية للمنهج الذي درسته
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {GRADES_DATA.map((grade) => {
            const isCurrent = grade.is_current_year;
            return (
              <div
                key={grade.id}
                onClick={() => onSelectGrade(grade.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-br from-emerald-50 to-indigo-50/40 dark:from-emerald-950/30 dark:to-indigo-950/30 border-emerald-300 dark:border-emerald-700 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {grade.academic_year}
                    </span>
                    {isCurrent ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        السنة الحالية
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        المنهج القديم
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {grade.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {grade.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>فتح محتوى الصف</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
