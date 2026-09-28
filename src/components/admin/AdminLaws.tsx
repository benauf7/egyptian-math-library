import React, { useState } from 'react';
import { 
  Calculator, 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  Layers,
  Filter
} from 'lucide-react';
import { MathFormula, GradeId } from '../../data/types';
import { MathView } from '../../utils/katex-render';
import { saveFormula, removeFormula, resetFormulasToDefault, getCustomFormulas } from '../../utils/custom-laws-db';

interface AdminLawsProps {
  formulas: MathFormula[];
  onRefreshFormulas: () => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
}

const GRADES_OPTIONS: { id: GradeId; name: string; stage: string }[] = [
  { id: 'primary_4', name: 'الصف الرابع الابتدائي', stage: 'primary' },
  { id: 'primary_5', name: 'الصف الخامس الابتدائي', stage: 'primary' },
  { id: 'primary_6', name: 'الصف السادس الابتدائي', stage: 'primary' },
  { id: 'prep_1', name: 'الصف الأول الإعدادي', stage: 'prep' },
  { id: 'prep_2', name: 'الصف الثاني الإعدادي', stage: 'prep' },
  { id: 'prep_3', name: 'الصف الثالث الإعدادي', stage: 'prep' },
  { id: 'sec_1', name: 'الصف الأول الثانوي (أولى بكالوريا)', stage: 'secondary' },
];

const BRANCHES = ['جبر', 'هندسة', 'حساب مثلثات', 'تفاضل وتكامل', 'إحصاء واحتمال', 'محددات ومصفوفات'];

export const AdminLaws: React.FC<AdminLawsProps> = ({
  formulas,
  onRefreshFormulas,
  isOpenAddModal,
  onCloseAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'builtin'>('all');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFormulaId, setActiveFormulaId] = useState<string>('');
  
  const [lawName, setLawName] = useState('');
  const [lawGradeId, setLawGradeId] = useState<GradeId>('sec_1');
  const [lawBranch, setLawBranch] = useState('جبر');
  const [lawTopic, setLawTopic] = useState('');
  const [lawLatex, setLawLatex] = useState('');
  const [lawMeaning, setLawMeaning] = useState('');
  const [lawProblem, setLawProblem] = useState('');
  const [lawSteps, setLawSteps] = useState('');
  const [lawAnswer, setLawAnswer] = useState('');
  const [lawNotes, setLawNotes] = useState('');

  const customFormulas = getCustomFormulas();
  const customIds = new Set(customFormulas.map(f => f.id));

  // Open Add Modal
  const openNewLawModal = () => {
    setIsEditing(false);
    setActiveFormulaId('custom_rule_' + Date.now());
    setLawName('');
    setLawGradeId('sec_1');
    setLawBranch('جبر');
    setLawTopic('');
    setLawLatex('س^2 - 4 = (س - 2)(س + 2)');
    setLawMeaning('قانون لتحليل المقادير الجبرية وحل المعادلات.');
    setLawProblem('أوجد مجموعة حل المعادلة: س² - ٩ = ٠ في ح');
    setLawSteps('س² = ٩\nس = ± جذر(٩)\nس = ٣ أو س = -٣');
    setLawAnswer('م.ح = { ٣ ، -٣ }');
    setLawNotes('انتبه لأخذ إشارتي الموجب والسالب عند أخذ الجذر التربيعي.');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditLawModal = (formula: MathFormula) => {
    setIsEditing(true);
    setActiveFormulaId(formula.id);
    setLawName(formula.name);
    setLawGradeId(formula.grade_id);
    setLawBranch(formula.branch);
    setLawTopic(formula.topic || formula.unit_name || '');
    setLawLatex(formula.latex);
    setLawMeaning(formula.meaning_explanation);
    setLawProblem(formula.example?.problem || '');
    setLawSteps((formula.example?.solution_steps || []).join('\n'));
    setLawAnswer(formula.example?.answer || '');
    setLawNotes((formula.notes || []).join('\n'));
    setIsModalOpen(true);
  };

  // Save Law
  const handleSaveLaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawName.trim() || !lawLatex.trim()) {
      alert('يرجى ملء اسم القانون وصيغة المعادلة.');
      return;
    }

    const gradeObj = GRADES_OPTIONS.find(g => g.id === lawGradeId) || GRADES_OPTIONS[6];

    const newFormula: MathFormula = {
      id: activeFormulaId,
      name: lawName.trim(),
      latex: lawLatex.trim(),
      grade_id: lawGradeId,
      grade_name: gradeObj.name,
      stage_id: gradeObj.stage as any,
      academic_year: '2026/2027',
      curriculum_version: 'egyptian_restructured_2024_2027',
      branch: lawBranch,
      unit_name: lawTopic.trim() || lawBranch,
      topic: lawTopic.trim() || lawBranch,
      symbol_definitions: [
        { symbol: 'س', meaning: 'المتغير المجهول' }
      ],
      meaning_explanation: lawMeaning.trim(),
      when_to_use: ['عند حل المعادلات والمسائل الحسابية المماثلة.'],
      solution_steps: lawSteps.split('\n').filter(s => s.trim().length > 0),
      example: {
        problem: lawProblem.trim(),
        solution_steps: lawSteps.split('\n').filter(s => s.trim().length > 0),
        answer: lawAnswer.trim()
      },
      notes: lawNotes.split('\n').filter(n => n.trim().length > 0),
      source: {
        source_title: 'مكتبة الرياضيات الشخصية (إشراف بن عوف)',
        academic_year: '2026/2027',
        grade: gradeObj.name,
        curriculum_version: 'egyptian_restructured_2024_2027',
        official_publisher: 'أرشيف الرياضيات المعتمد'
      }
    };

    saveFormula(newFormula);
    onRefreshFormulas();
    setIsModalOpen(false);
  };

  // Delete Law
  const handleDeleteLaw = (formula: MathFormula) => {
    const isCustom = customIds.has(formula.id);
    const confirmDelete = window.confirm(
      isCustom 
        ? `هل تريد حذف القانون المخصص "${formula.name}" نهائياً؟` 
        : `هل تريد إخفاء واستبعاد القانون الأساسي "${formula.name}" من المكتبة؟`
    );

    if (confirmDelete) {
      removeFormula(formula.id);
      onRefreshFormulas();
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    const confirmReset = window.confirm('هل تريد استعادة جميع القوانين الأصلية للمناهج وإلغاء أي تعديلات أو إخفاءات سابقة؟');
    if (confirmReset) {
      resetFormulasToDefault();
      onRefreshFormulas();
    }
  };

  // Filtering
  const filteredFormulas = formulas.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.meaning_explanation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedGrade !== 'all' && f.grade_id !== selectedGrade) return false;
    if (selectedBranch !== 'all' && f.branch !== selectedBranch) return false;
    
    if (filterType === 'custom') return customIds.has(f.id);
    if (filterType === 'builtin') return !customIds.has(f.id);

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-purple-500" />
            <span>إدارة القوانين والمعادلات الرياضية ({formulas.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إضافة قوانين جديدة، تعديل القواعد والشروح، وحذف أو إخفاء أي قانون من الأرشيف
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openNewLawModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة قانون جديد</span>
          </button>

          <button
            onClick={handleResetToDefault}
            title="استعادة القوانين الافتراضية الأصلية"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="ابحث عن قانون: المميز، فيثاغورس، س² - ٤، المتطابقات المثلثية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full md:w-56 px-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">جميع الصفوف الدراسية</option>
            {GRADES_OPTIONS.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full md:w-44 px-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <option value="all">جميع الفروع</option>
            {BRANCHES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Source Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400">التصنيف:</span>
          {[
            { id: 'all', label: `الكل (${formulas.length})` },
            { id: 'custom', label: `قوانين مخصصة (${customFormulas.length})` },
            { id: 'builtin', label: 'المنهج الأساسي المعتمد' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setFilterType(p.id as any)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                filterType === p.id 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* Laws List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 text-xs rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            لم يتم العثور على أي قوانين تطابق شروط البحث.
          </div>
        ) : (
          filteredFormulas.map(f => {
            const isCustom = customIds.has(f.id);
            return (
              <div 
                key={f.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {f.grade_name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {f.branch}
                        </span>
                        {isCustom && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>مضاف خصيصاً</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {f.name}
                      </h3>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditLawModal(f)}
                        title="تعديل هذا القانون"
                        className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLaw(f)}
                        title="حذف أو إخفاء القانون"
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Math Formula KaTeX Render */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-center min-h-[50px] overflow-x-auto text-indigo-600 dark:text-indigo-300">
                    <MathView math={f.latex} block={true} />
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {f.meaning_explanation}
                  </p>

                  {/* Example preview */}
                  {f.example && (
                    <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                      <span className="font-bold block mb-0.5">مثال: {f.example.problem}</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold block">الناتج: {f.example.answer}</span>
                    </div>
                  )}

                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">ID: {f.id.slice(0, 18)}</span>
                  <span>{f.academic_year || '2026/2027'}</span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Law Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {isEditing ? 'تعديل القانون الرياضي' : 'إضافة قانون ومعادلة رياضية جديدة'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    سيظهر القانون فوراً لجميع الطلاب في المكتبة
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLaw} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Law Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم القانون / القاعدة *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: مجموع وفرق مكعبين"
                    value={lawName}
                    onChange={(e) => setLawName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الصف الدراسي *
                  </label>
                  <select
                    value={lawGradeId}
                    onChange={(e) => setLawGradeId(e.target.value as GradeId)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    {GRADES_OPTIONS.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Branch */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الفرع الرياضي *
                  </label>
                  <select
                    value={lawBranch}
                    onChange={(e) => setLawBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Topic / Unit */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الموضوع أو الوحدة
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: تحليل المقادير الجبرية"
                    value={lawTopic}
                    onChange={(e) => setLawTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>

              </div>

              {/* LaTeX Formula with Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    صيغة المعادلة (LaTeX / Math) *
                  </label>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                    معاينة حية فورية بالأسفل
                  </span>
                </div>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="س^3 + ص^3 = (س + ص)(س^2 - س ص + ص^2)"
                  value={lawLatex}
                  onChange={(e) => setLawLatex(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />

                {/* Live Formula Preview Box */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col items-center justify-center min-h-[55px] text-indigo-700 dark:text-indigo-300">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">المعاينة كما يراها الطالب:</span>
                  <MathView math={lawLatex} block={true} />
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الشرح المبسط ومدلول القانون
                </label>
                <textarea
                  rows={2}
                  placeholder="اكتب شرحاً مبسطاً لطريقة استخدام القانون..."
                  value={lawMeaning}
                  onChange={(e) => setLawMeaning(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 leading-relaxed"
                />
              </div>

              {/* Example Problem (with Arabic letters س, ص) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  مثال تطبيقي بالعربي (س ، ص)
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                    نص المسألة
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: حل المعادلة س² - ٤ = ٠"
                    value={lawProblem}
                    onChange={(e) => setLawProblem(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                    خطوات الحل (اكتب كل خطوة في سطر منفصل)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="الخطوة 1: س² = 4&#10;الخطوة 2: س = ± 2"
                    value={lawSteps}
                    onChange={(e) => setLawSteps(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                    الناتج النهائي
                  </label>
                  <input
                    type="text"
                    placeholder="م.ح = { ٢ ، -٢ }"
                    value={lawAnswer}
                    onChange={(e) => setLawAnswer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Tips and Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تنبيهات وملاحظات هامة (كل ملاحظة في سطر)
                </label>
                <textarea
                  rows={2}
                  placeholder="ملاحظة هامة: لا يمكن قسمة المقام على صفر..."
                  value={lawNotes}
                  onChange={(e) => setLawNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  {isEditing ? 'حفظ التعديلات' : 'نشر القانون في المكتبة'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
