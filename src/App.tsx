import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { EmailSimulatorDrawer } from './components/EmailSimulatorDrawer';
import { EmailConfigModal } from './components/EmailConfigModal';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './components/Dashboard';
import { FoundationsView } from './components/FoundationsView';
import { TimelineView } from './components/TimelineView';
import { FormulasList } from './components/FormulasList';
import { LessonsList } from './components/LessonsList';
import { MethodsView } from './components/MethodsView';
import { FactoringMastery } from './components/FactoringMastery';
import { FavoritesTracker } from './components/FavoritesTracker';
import { BookExportView } from './components/BookExportView';
import { FormulaDetailModal } from './components/FormulaDetailModal';
import { LessonDetailModal } from './components/LessonDetailModal';
import { SourceModal } from './components/SourceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getStoredTheme, setStoredTheme, addRecentItem } from './utils/storage';
import { getFormulaById } from './data/formulas';
import { getLessonById } from './data/lessons';
import { MathFormula, MathLesson, SourceReference } from './data/types';
import { Calculator, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('dashboard') || hash.includes('dashboard');
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState<boolean>(false);
  const [isEmailConfigOpen, setIsEmailConfigOpen] = useState<boolean>(false);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string | undefined>();

  // Modals state
  const [activeFormula, setActiveFormula] = useState<MathFormula | null>(null);
  const [activeLesson, setActiveLesson] = useState<MathLesson | null>(null);
  const [activeSource, setActiveSource] = useState<SourceReference | null>(null);

  // Synchronize URL routing for /dashboard and #dashboard
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminRoute(path.includes('dashboard') || hash.includes('dashboard'));
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToAdminDashboard = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/dashboard');
      setIsAdminRoute(true);
    }
  };

  const returnToLibrary = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      setIsAdminRoute(false);
    }
  };

  // Initialize theme
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setIsDark(savedTheme === 'dark');
    setStoredTheme(savedTheme);
  }, []);

  const handleToggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    setStoredTheme(next);
  };

  const handleSelectFormula = (formulaId: string) => {
    const f = getFormulaById(formulaId);
    if (f) {
      setActiveFormula(f);
      addRecentItem({
        id: f.id,
        type: 'formula',
        title: f.name,
        grade_name: f.grade_name,
        academic_year: f.academic_year
      });
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    const l = getLessonById(lessonId);
    if (l) {
      setActiveLesson(l);
      addRecentItem({
        id: l.id,
        type: 'lesson',
        title: l.title,
        grade_name: l.grade_name,
        academic_year: l.academic_year
      });
    }
  };

  const handleSelectGrade = (gradeId: string) => {
    setSelectedGradeFilter(gradeId);
    setCurrentTab('formulas');
  };

  const handleShowSource = (item: any) => {
    if (item.source) {
      setActiveSource(item.source);
    } else if (item.source_title) {
      setActiveSource(item as SourceReference);
    }
  };

  if (isAdminRoute) {
    return (
      <>
        <AdminDashboard
          onReturnToLibrary={returnToLibrary}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />
        {/* Authentication Modal */}
        <AuthModal onOpenEmailConfig={() => setIsEmailConfigOpen(true)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors selection:bg-indigo-500 selection:text-white">
      
      {/* Right Sidebar for RTL Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'formulas') setSelectedGradeFilter(undefined);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72 transition-all">
        
        {/* Top Header containing search bar, controls, auth profile, and email simulator */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentTab === 'dashboard') {
              setCurrentTab('formulas');
            }
          }}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onQuickPrint={() => setCurrentTab('print')}
          onOpenEmailDrawer={() => setIsEmailDrawerOpen(true)}
          onOpenEmailConfig={() => setIsEmailConfigOpen(true)}
          onOpenAdminDashboard={navigateToAdminDashboard}
        />

        {/* Scrollable Page Body with generous, comfortable spacing */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
          
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'formulas') setSelectedGradeFilter(undefined);
              }}
              onSelectGrade={handleSelectGrade}
              onSelectFormula={handleSelectFormula}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentTab === 'foundations' && (
            <FoundationsView />
          )}

          {currentTab === 'timeline' && (
            <TimelineView
              onSelectFormula={handleSelectFormula}
              onSelectLesson={handleSelectLesson}
              onShowSource={handleShowSource}
            />
          )}

          {currentTab === 'formulas' && (
            <FormulasList
              searchQuery={searchQuery}
              onSelectFormula={handleSelectFormula}
              onShowSource={handleShowSource}
              initialGradeId={selectedGradeFilter}
            />
          )}

          {currentTab === 'factoring' && (
            <FactoringMastery onShowSource={handleShowSource} />
          )}

          {currentTab === 'methods' && (
            <MethodsView onShowSource={handleShowSource} />
          )}

          {currentTab === 'lessons' && (
            <LessonsList
              searchQuery={searchQuery}
              onSelectLesson={handleSelectLesson}
              onShowSource={handleShowSource}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesTracker
              onSelectFormula={handleSelectFormula}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentTab === 'print' && (
            <BookExportView />
          )}

        </main>

        {/* Footer */}
        <footer className="print:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <span>مكتبة الرياضيات الشخصية • أرشيف مناهج مصر الرسمية (2020 - 2027)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>المناهج المعتمدة قبل منظومة 2.0 + أولى بكالوريا المحدثة</span>
              </span>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      <FormulaDetailModal
        formula={activeFormula}
        onClose={() => setActiveFormula(null)}
        onShowSource={handleShowSource}
      />

      <LessonDetailModal
        lesson={activeLesson}
        onClose={() => setActiveLesson(null)}
        onShowSource={handleShowSource}
        onSelectFormula={handleSelectFormula}
      />

      <SourceModal
        source={activeSource}
        onClose={() => setActiveSource(null)}
      />

      {/* Authentication Modal with 5 tabs */}
      <AuthModal onOpenEmailConfig={() => setIsEmailConfigOpen(true)} />

      {/* Simulated Email Inbox Drawer */}
      <EmailSimulatorDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        onOpenEmailConfig={() => setIsEmailConfigOpen(true)}
      />

      {/* Real Email Server Configuration Modal */}
      <EmailConfigModal
        isOpen={isEmailConfigOpen}
        onClose={() => setIsEmailConfigOpen(false)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
export default App;
