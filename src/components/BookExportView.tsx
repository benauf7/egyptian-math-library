import React, { useState } from 'react';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { FACTORING_METHODS } from '../data/factoring';
import { SOLUTION_METHODS } from '../data/methods';
import { GRADES_DATA } from '../data/curriculum/grades';
import { OFFICIAL_SOURCES } from '../data/sources';
import { MathView } from '../utils/katex-render';
import { 
  Printer, 
  FileDown, 
  BookOpen, 
  CheckCircle2, 
  Calculator, 
  Layers, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const BookExportView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'primary' | 'prep' | 'sec'>('all');

  const handlePrint = () => {
    window.print();
  };

  const primaryGrades = GRADES_DATA.filter(g => g.stage === 'primary');
  const prepGrades = GRADES_DATA.filter(g => g.stage === 'prep');
  const secGrades = GRADES_DATA.filter(g => g.stage === 'secondary');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Controls Bar (Hidden during Print) */}
      <div className="print:hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-6 h-6 text-indigo-500" />
            <span>كتاب مكتبة الرياضيات الشخصية (PDF / طباعة)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            كتاب متكامل مرتب حسب الأصول: غلاف، فهرس، المراحل، الصفوف، فهارس القوانين والتحليل، والمصادر.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              الكتاب كاملاً
            </button>
            <button
              onClick={() => setSelectedFilter('primary')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'primary' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              الابتدائي
            </button>
            <button
              onClick={() => setSelectedFilter('prep')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'prep' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              الإعدادي
            </button>
            <button
              onClick={() => setSelectedFilter('sec')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'sec' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              أولى بكالوريا
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>حفظ كـ PDF / طباعة فورية</span>
          </button>
        </div>
      </div>

      {/* The Printable Book Document Container */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-14 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none max-w-4xl mx-auto space-y-12">
        
        {/* ==================== 1. BOOK COVER (غلاف الكتاب) ==================== */}
        {(selectedFilter === 'all') && (
          <div className="text-center py-20 border-b-4 border-double border-slate-300 print:min-h-screen print:flex print:flex-col print:justify-between print:py-24 page-break-after">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 border border-indigo-200 px-4 py-1.5 rounded-full inline-block">
                الجمهورية العربية المصرية • سجل التوثيق الرياضي
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-6">
                مكتبة الرياضيات الشخصية
              </h1>
              <p className="text-lg font-bold text-indigo-700">
                أرشيف المناهج المعتمدة رسمياً عبر مسيرتي الدراسية
              </p>
              <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed pt-2">
                من الصف الرابع الابتدائي (2020/2021) حتى أولى بكالوريا / الصف الأول الثانوي (2026/2027)
              </p>
            </div>

            <div className="my-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-right max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-600">الصفحات والصفوف الموثقة:</span>
                <span className="font-bold text-slate-900">7 صفوف دراسية (ابتدائي - إعدادي - بكالوريا)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-600">نسخة المناهج المعتمدة:</span>
                <span className="font-bold text-slate-900">المنهج القديم + هيكلة الثانوية 2026/2027</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-600">الجهة المرجعية:</span>
                <span className="font-bold text-slate-900">وزارة التربية والتعليم والتعليم الفني</span>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              طُبع هذا الكتاب الشخصي آلياً بترميز الخط العربي الأصيل ومعادلات KaTeX الرياضية الدقيقة
            </div>
          </div>
        )}

        {/* ==================== 2. TABLE OF CONTENTS (الفهرس العام) ==================== */}
        {(selectedFilter === 'all') && (
          <div className="space-y-6 pt-6 border-b border-slate-200 pb-8 page-break-after">
            <h2 className="text-2xl font-black text-slate-900 pb-2 border-b-2 border-indigo-600 inline-block">
              فهرس المحتويات العام
            </h2>
            <div className="space-y-3 text-xs sm:text-sm font-semibold">
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>1. المرحلة الابتدائية (رابعة 2020/2021، خامسة 2021/2022، سادسة 2022/2023)</span>
                <span className="font-mono text-indigo-600">الصفحة 3</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>2. المرحلة الإعدادية (أولى 2023/2024، ثانية 2024/2025، ثالثة 2025/2026)</span>
                <span className="font-mono text-indigo-600">الصفحة 7</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>3. أولى بكالوريا (الصف الأول الثانوي 2026/2027 - المنهج المطور)</span>
                <span className="font-mono text-indigo-600">الصفحة 12</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>4. الفهرس الشامل للقوانين الرياضية والصيغ</span>
                <span className="font-mono text-indigo-600">الصفحة 16</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>5. الفهرس التخصصي لمنظومة التحليل الجبري الشاملة</span>
                <span className="font-mono text-indigo-600">الصفحة 19</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50 border-b border-dashed border-slate-200">
                <span>6. فهرس طرق وخوارزميات حل المسائل الرياضية</span>
                <span className="font-mono text-indigo-600">الصفحة 21</span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-slate-50">
                <span>7. المصادر والمراجع والقرارات الوزارية الرسمية</span>
                <span className="font-mono text-indigo-600">الصفحة 23</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. PRIMARY STAGE (المرحلة الابتدائية) ==================== */}
        {(selectedFilter === 'all' || selectedFilter === 'primary') && (
          <div className="space-y-8 page-break-after">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
              <span className="text-xs font-bold text-indigo-600">الباب الأول</span>
              <h2 className="text-2xl font-black text-indigo-900 mt-1">المرحلة الابتدائية (المنهج القديم)</h2>
              <p className="text-xs text-indigo-700 mt-1">
                تشمل الصف الرابع (2020/2021)، الخامس (2021/2022)، والسادس (2022/2023)
              </p>
            </div>

            {primaryGrades.map((grade) => {
              const gradeFormulas = ALL_FORMULAS.filter(f => f.grade_id === grade.id);
              const gradeLessons = ALL_LESSONS.filter(l => l.grade_id === grade.id);
              return (
                <div key={grade.id} className="space-y-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">{grade.name}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      العام الدراسي: {grade.academic_year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{grade.description}</p>

                  {/* Lessons */}
                  {gradeLessons.map(l => (
                    <div key={l.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-indigo-600">درس: {l.title}</span>
                      <p className="text-slate-700 font-semibold">{l.formula_explanation}</p>
                      <div className="space-y-1 text-slate-600">
                        {l.examples.slice(0, 2).map((ex, exIdx) => (
                          <div key={exIdx} className="bg-white p-2.5 rounded border border-slate-200">
                            <span className="font-bold text-indigo-700">{ex.title}: </span>
                            <span>{ex.question} ⟹ </span>
                            <span className="font-bold text-emerald-600">الناتج: {ex.final_answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Formulas */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {gradeFormulas.map(f => (
                      <div key={f.id} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                        <span className="font-bold text-slate-800 block">{f.name}</span>
                        <div className="text-center py-1">
                          <MathView math={f.latex} block={false} />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{f.meaning_explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================== 4. PREP STAGE (المرحلة الإعدادية) ==================== */}
        {(selectedFilter === 'all' || selectedFilter === 'prep') && (
          <div className="space-y-8 page-break-after">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-xs font-bold text-purple-600">الباب الثاني</span>
              <h2 className="text-2xl font-black text-purple-900 mt-1">المرحلة الإعدادية (المنهج القديم)</h2>
              <p className="text-xs text-purple-700 mt-1">
                تشمل الصف الأول (2023/2024)، الثاني (2024/2025)، والثالث الإعدادي (2025/2026)
              </p>
            </div>

            {prepGrades.map((grade) => {
              const gradeFormulas = ALL_FORMULAS.filter(f => f.grade_id === grade.id);
              const gradeLessons = ALL_LESSONS.filter(l => l.grade_id === grade.id);
              return (
                <div key={grade.id} className="space-y-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">{grade.name}</h3>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                      العام الدراسي: {grade.academic_year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{grade.description}</p>

                  {/* Lessons */}
                  {gradeLessons.map(l => (
                    <div key={l.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-purple-700">درس: {l.title}</span>
                      <p className="text-slate-700 font-semibold">{l.formula_explanation}</p>
                      <div className="space-y-1 text-slate-600">
                        {l.examples.slice(0, 2).map((ex, exIdx) => (
                          <div key={exIdx} className="bg-white p-2.5 rounded border border-slate-200">
                            <span className="font-bold text-purple-700">{ex.title}: </span>
                            <span>{ex.question} ⟹ </span>
                            <span className="font-bold text-emerald-600">الناتج: {ex.final_answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Formulas */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {gradeFormulas.map(f => (
                      <div key={f.id} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                        <span className="font-bold text-slate-800 block">{f.name}</span>
                        <div className="text-center py-1">
                          <MathView math={f.latex} block={false} />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{f.meaning_explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================== 5. SECONDARY / BACCALAUREATE (أولى بكالوريا) ==================== */}
        {(selectedFilter === 'all' || selectedFilter === 'sec') && (
          <div className="space-y-8 page-break-after">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-600">الباب الثالث</span>
              <h2 className="text-2xl font-black text-emerald-900 mt-1">أولى بكالوريا (الصف الأول الثانوي 2026/2027)</h2>
              <p className="text-xs text-emerald-700 mt-1">
                المنهج المطور المعتمد رسمياً بعد إعادة هيكلة الثانوية العامة المصرية
              </p>
            </div>

            {secGrades.map((grade) => {
              const gradeFormulas = ALL_FORMULAS.filter(f => f.grade_id === grade.id && !f.is_extra_curricular);
              const gradeLessons = ALL_LESSONS.filter(l => l.grade_id === grade.id);
              return (
                <div key={grade.id} className="space-y-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">{grade.name}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      العام الدراسي: {grade.academic_year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{grade.description}</p>

                  {/* Lessons */}
                  {gradeLessons.map(l => (
                    <div key={l.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-emerald-700">درس: {l.title}</span>
                      <p className="text-slate-700 font-semibold">{l.formula_explanation}</p>
                      <div className="space-y-1 text-slate-600">
                        {l.examples.slice(0, 2).map((ex, exIdx) => (
                          <div key={exIdx} className="bg-white p-2.5 rounded border border-slate-200">
                            <span className="font-bold text-emerald-700">{ex.title}: </span>
                            <span>{ex.question} ⟹ </span>
                            <span className="font-bold text-emerald-600">الناتج: {ex.final_answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Formulas */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {gradeFormulas.map(f => (
                      <div key={f.id} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                        <span className="font-bold text-slate-800 block">{f.name}</span>
                        <div className="text-center py-1">
                          <MathView math={f.latex} block={false} />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{f.meaning_explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================== 6. FACTORING INDEX (فهرس التحليل) ==================== */}
        {(selectedFilter === 'all') && (
          <div className="space-y-6 pt-6 border-b border-slate-200 pb-8 page-break-after">
            <h2 className="text-2xl font-black text-slate-900 pb-2 border-b-2 border-purple-600 inline-block">
              فهرس منظومة التحليل الجبري
            </h2>
            <div className="space-y-4">
              {FACTORING_METHODS.map((method, idx) => (
                <div key={method.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{idx + 1}. {method.name} ({method.academic_year})</span>
                    <span className="font-mono text-purple-700">{method.name_en}</span>
                  </div>
                  <div className="text-center py-1 font-bold">
                    <MathView math={method.algebraic_form} block={false} />
                  </div>
                  <p className="text-slate-600">{method.steps.join(' ⟵ ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 7. METHODS INDEX (فهرس طرق الحل) ==================== */}
        {(selectedFilter === 'all') && (
          <div className="space-y-6 pt-6 border-b border-slate-200 pb-8 page-break-after">
            <h2 className="text-2xl font-black text-slate-900 pb-2 border-b-2 border-amber-500 inline-block">
              فهرس طرق وخوارزميات حل المسائل
            </h2>
            <div className="space-y-4">
              {SOLUTION_METHODS.map((method, idx) => (
                <div key={method.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{idx + 1}. {method.name} - {method.grade_name}</span>
                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{method.category}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 8. OFFICIAL REFERENCES (المراجع والمصادر الرسمية) ==================== */}
        {(selectedFilter === 'all') && (
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-black text-slate-900 pb-2 border-b-2 border-emerald-600 inline-block">
              المراجع والتوثيق الرسمي للوزارة
            </h2>
            <div className="space-y-3 text-xs">
              {Object.values(OFFICIAL_SOURCES).map((src, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{idx + 1}. {src.source_title}</span>
                    <span className="text-emerald-700">{src.academic_year}</span>
                  </div>
                  <p className="text-slate-600">
                    الجهة: {src.official_publisher} {src.notes && `• ${src.notes}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
