export type AcademicYear = 
  | '2020/2021' 
  | '2021/2022' 
  | '2022/2023' 
  | '2023/2024' 
  | '2024/2025' 
  | '2025/2026' 
  | '2026/2027';

export type GradeId = 
  | 'primary_4' 
  | 'primary_5' 
  | 'primary_6' 
  | 'prep_1' 
  | 'prep_2' 
  | 'prep_3' 
  | 'sec_1';

export type StageId = 'primary' | 'prep' | 'secondary';

export type CurriculumVersion = 
  | 'egyptian_old_curriculum' 
  | 'egyptian_restructured_2024_2027' 
  | 'extra_curricular';

export interface SourceReference {
  source_title: string;
  source_url?: string;
  academic_year: AcademicYear | string;
  grade: string;
  curriculum_version: CurriculumVersion | string;
  official_publisher: string;
  notes?: string;
}

export interface SymbolDefinition {
  symbol: string;
  meaning: string;
}

export interface ConceptDefinition {
  term: string;
  term_en?: string;
  definition: string;
  math_formula?: string;
}

export interface ExampleProblem {
  title: string;
  level: 'بسيط' | 'متوسط' | 'متقدم' | 'تطبيقي';
  question: string;
  solution_steps: string[];
  final_answer: string;
  notes?: string;
}

export type CommonMistake = string | {
  mistake: string;
  correct_explanation: string;
};

export interface MathLesson {
  id: string;
  title: string;
  title_en?: string;
  grade_id: GradeId;
  grade_name: string;
  stage_id: StageId;
  academic_year: AcademicYear;
  curriculum_version: CurriculumVersion;
  term: 1 | 2;
  unit_number: number;
  unit_name: string;
  lesson_number: number;
  branch: string;
  key_concepts: string[];
  definitions: ConceptDefinition[];
  formula_ids: string[];
  used_symbols: SymbolDefinition[];
  formula_explanation: string;
  when_to_use: string[];
  solution_steps: string[];
  examples: ExampleProblem[];
  common_mistakes: CommonMistake[];
  shortcuts_and_tricks?: string[];
  formula_relations?: string[];
  related_formula_ids?: string[];
  related_lesson_ids?: string[];
  source: SourceReference;
}

export interface MathFormula {
  id: string;
  name: string;
  name_en?: string;
  latex: string;
  grade_id: GradeId;
  grade_name: string;
  stage_id: StageId;
  academic_year: AcademicYear;
  curriculum_version: CurriculumVersion;
  branch: string;
  unit_name: string;
  topic: string;
  symbol_definitions: SymbolDefinition[];
  meaning_explanation: string;
  when_to_use: string[];
  solution_steps: string[];
  example: {
    problem: string;
    solution_steps: string[];
    answer: string;
  };
  common_mistakes?: string[];
  notes: string[];
  related_formula_ids?: string[];
  source: SourceReference;
  is_factoring?: boolean;
  is_extra_curricular?: boolean;
}

export interface SolutionMethod {
  id: string;
  name: string;
  name_en?: string;
  category: 
    | 'معادلات' 
    | 'تحليل' 
    | 'تبسيط' 
    | 'نسب وتناسب' 
    | 'مسائل لفظية' 
    | 'هندسة' 
    | 'مساحات وحجوم' 
    | 'إحصاء واحتمالات' 
    | 'دوال' 
    | 'حساب ومثلثات'
    | 'أخرى';
  grade_id: GradeId;
  grade_name: string;
  academic_year: AcademicYear;
  curriculum_version: CurriculumVersion;
  description: string;
  steps: string[];
  examples: {
    title: string;
    problem: string;
    solution: string[];
  }[];
  pro_tips?: string[];
  source: SourceReference;
}

export interface FactoringMethod {
  id: string;
  name: string;
  name_en: string;
  algebraic_form: string;
  grade_id: GradeId;
  academic_year: AcademicYear;
  curriculum_version: CurriculumVersion;
  how_to_recognize: string[];
  steps: string[];
  solved_examples: {
    expression: string;
    steps: string[];
    factored: string;
    note?: string;
  }[];
  common_pitfalls: string[];
  is_extra_curricular?: boolean;
  source: SourceReference;
}

export interface GradeInfo {
  id: GradeId;
  name: string;
  stage: StageId;
  academic_year: AcademicYear;
  curriculum_name: string;
  curriculum_version: CurriculumVersion;
  is_current_year?: boolean;
  official_book: string;
  description: string;
  branches: string[];
}
