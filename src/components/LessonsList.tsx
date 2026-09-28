import React, { useState } from 'react';
import { ALL_LESSONS } from '../data/lessons';
import { GRADES_DATA } from '../data/curriculum/grades';
import { MathLesson } from '../data/types';
import { 
  BookOpen, 
  ChevronLeft, 
  ShieldCheck, 
  Bookmark, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useUserStorage } from '../utils/storage';

interface LessonsListProps {
  searchQuery: string;
  onSelectLesson: (id: string) => void;
  onShowSource: (lesson: MathLesson) => void;
}

export const LessonsList: React.FC<LessonsListProps> = ({
  searchQuery,
  onSelectLesson,
  onShowSource
}) => {
  const { isFav, isRev, toggleFav, toggleRev } = useUserStorage();
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const filteredLessons = ALL_LESSONS.filter((lesson) => {
    if (selectedGrade !== 'all' && lesson.grade_id !== selectedGrade) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchTitleEn = lesson.title_en?.toLowerCase().includes(q) || false;
      const matchUnit = lesson.unit_name.toLowerCase().includes(q);
      const matchConcepts = lesson.key_concepts.some(c => c.toLowerCase().includes(q));
      const matchDefs = lesson.definitions.some(d => d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q));

      if (!matchTitle && !matchTitleEn && !matchUnit && !matchConcepts && !matchDefs) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <span>دروس المنهج الدراسي الموثقة</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            كل درس يحتوي على 20 نقطة تعليمية متكاملة تشمل المفاهيم، القوانين، 4 أمثلة متدرجة، والأخطاء الشائعة
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          عرض <span className="font-bold text-emerald-600 dark:text-emerald-400">{filteredLessons.length}</span> درس
        </div>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setSelectedGrade('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            selectedGrade === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          كل الصفوف
        </button>
        {GRADES_DATA.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGrade(g.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedGrade === g.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {g.name} ({g.academic_year})
          </button>
        ))}
      </div>

      {/* Lessons Cards */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">لم يتم العثور على أي درس</h3>
          <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر صفاً دراسياً مختلفاً.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const fav = isFav(lesson.id);
            const reviewed = isRev(lesson.id);

            return (
              <div
                key={lesson.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        {lesson.grade_name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {lesson.academic_year}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {lesson.unit_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFav(lesson.id)}
                        className={`p-1.5 rounded-lg border ${
                          fav ? 'bg-amber-500 text-white border-amber-600' : 'text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => toggleRev(lesson.id)}
                        className={`p-1.5 rounded-lg border ${
                          reviewed ? 'bg-emerald-600 text-white border-emerald-700' : 'text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectLesson(lesson.id)}
                    className="text-base font-black text-slate-900 dark:text-white cursor-pointer hover:text-emerald-600 transition-colors mb-1"
                  >
                    {lesson.title}
                  </h3>
                  {lesson.title_en && (
                    <p className="text-[11px] text-slate-400 font-mono mb-2" dir="ltr">{lesson.title_en}</p>
                  )}

                  {/* Key Concepts Snippet */}
                  <div className="space-y-1.5 my-3">
                    <span className="text-[11px] font-bold text-slate-400 block">المفاهيم المحورية:</span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {lesson.key_concepts.slice(0, 3).map((kc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="line-clamp-1">{kc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onShowSource(lesson)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>المصدر الرسمي</span>
                  </button>

                  <button
                    onClick={() => onSelectLesson(lesson.id)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>فتح محتوى الدرس الـ 20 نقطة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
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
