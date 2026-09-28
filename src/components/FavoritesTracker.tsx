import React, { useState } from 'react';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { 
  getFavorites, 
  getReviewed, 
  getNeedsReview, 
  toggleFavorite, 
  toggleReviewed,
  removeFromNeedsReview
} from '../utils/storage';
import { 
  Bookmark, 
  CheckCircle2, 
  Star, 
  Trash2, 
  ArrowRight,
  Calculator,
  BookOpen
} from 'lucide-react';
import { MathView } from '../utils/katex-render';

interface FavoritesTrackerProps {
  onSelectFormula: (id: string) => void;
  onSelectLesson: (id: string) => void;
}

export const FavoritesTracker: React.FC<FavoritesTrackerProps> = ({
  onSelectFormula,
  onSelectLesson
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'reviewed' | 'needs_review'>('favorites');
  const [, setRefreshKey] = useState(0);

  const forceRefresh = () => setRefreshKey(k => k + 1);

  const favIds = getFavorites();
  const reviewedIds = getReviewed();
  const needsReviewIds = getNeedsReview();

  const getItemsForIds = (ids: string[]) => {
    return ids.map(id => {
      const formula = ALL_FORMULAS.find(f => f.id === id);
      if (formula) return { ...formula, itemType: 'formula' as const };
      const lesson = ALL_LESSONS.find(l => l.id === id);
      if (lesson) return { ...lesson, itemType: 'lesson' as const };
      return null;
    }).filter(Boolean);
  };

  const currentItems = getItemsForIds(
    activeTab === 'favorites' 
      ? favIds 
      : activeTab === 'reviewed' 
      ? reviewedIds 
      : needsReviewIds
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
          <span>المفضلة ومسار المراجعة الشخصي</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          إدارة القوانين والموضوعات المفضلة وتتبع حالتك الدراسية والمواد التي تتطلب مراجعة إضافية
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>المفضلة ({favIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviewed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'reviewed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تمت المراجعة ({reviewedIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('needs_review')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'needs_review'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>تحتاج مراجعة ({needsReviewIds.length})</span>
        </button>
      </div>

      {/* Items List */}
      {currentItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">القائمة فارغة حالياً</h3>
          <p className="text-xs text-slate-400">
            يمكنك إضافة القوانين والدروس إلى المفضلة أو تحديدها كمراجعة من خلال بطاقات القوانين في أي وقت.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((item: any) => {
            const isFormula = item.itemType === 'formula';
            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.grade_name} • {item.academic_year}
                    </span>
                    <button
                      onClick={() => {
                        if (activeTab === 'favorites') toggleFavorite(item.id);
                        else if (activeTab === 'reviewed') toggleReviewed(item.id);
                        else if (activeTab === 'needs_review') removeFromNeedsReview(item.id);
                        forceRefresh();
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      title="إزالة من القائمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                    {item.name || item.title}
                  </h3>

                  {isFormula && item.latex && (
                    <div className="p-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                      <MathView math={item.latex} block={false} />
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.meaning_explanation || (item.key_concepts && item.key_concepts.join(' • '))}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                    {isFormula ? 'قانون رياضي' : 'درس كامل'}
                  </span>
                  <button
                    onClick={() => {
                      if (isFormula) onSelectFormula(item.id);
                      else onSelectLesson(item.id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>فتح البطاقة</span>
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
