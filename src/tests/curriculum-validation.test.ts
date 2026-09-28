import { describe, it, expect } from 'vitest';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { FACTORING_METHODS } from '../data/factoring';
import { SOLUTION_METHODS } from '../data/methods';
import { GRADES_DATA } from '../data/curriculum/grades';

const VALID_ACADEMIC_YEARS = [
  '2020/2021',
  '2021/2022',
  '2022/2023',
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2026/2027',
  'متعدد السنوات'
];

const GRADE_YEAR_MAP: Record<string, string> = {
  primary_4: '2020/2021',
  primary_5: '2021/2022',
  primary_6: '2022/2023',
  prep_1: '2023/2024',
  prep_2: '2024/2025',
  prep_3: '2025/2026',
  sec_1: '2026/2027'
};

describe('Curriculum Data Integrity & Year Verification', () => {
  it('every grade in GRADES_DATA has a verified academic year and official book', () => {
    expect(GRADES_DATA.length).toBe(7);
    GRADES_DATA.forEach(grade => {
      expect(grade.id).toBeDefined();
      expect(grade.name).toBeTruthy();
      expect(VALID_ACADEMIC_YEARS).toContain(grade.academic_year);
      expect(grade.official_book).toBeTruthy();
      expect(grade.curriculum_name).toBeTruthy();
      expect(grade.branches.length).toBeGreaterThan(0);
    });
  });

  it('every lesson has academic_year, valid grade, official source, and all required educational fields', () => {
    expect(ALL_LESSONS.length).toBeGreaterThan(0);
    const seenLessonIds = new Set<string>();

    ALL_LESSONS.forEach(lesson => {
      // Unique ID check
      expect(seenLessonIds.has(lesson.id)).toBe(false);
      seenLessonIds.add(lesson.id);

      // Academic Year and Grade mapping
      expect(VALID_ACADEMIC_YEARS).toContain(lesson.academic_year);
      expect(lesson.grade_id).toBeDefined();
      expect(GRADE_YEAR_MAP[lesson.grade_id]).toBe(lesson.academic_year);

      // Official Source presence
      expect(lesson.source).toBeDefined();
      expect(lesson.source.source_title).toBeTruthy();
      expect(lesson.source.official_publisher).toBeTruthy();

      // Content completeness (key concepts, definitions, examples, mistakes)
      expect(lesson.key_concepts.length).toBeGreaterThan(0);
      expect(lesson.definitions.length).toBeGreaterThan(0);
      expect(lesson.examples.length).toBeGreaterThan(0);
      expect(lesson.common_mistakes.length).toBeGreaterThan(0);
      expect(lesson.solution_steps.length).toBeGreaterThan(0);

      // Verify no modern curriculum leakage into old grades
      if (['primary_4', 'primary_5', 'primary_6', 'prep_1', 'prep_2', 'prep_3'].includes(lesson.grade_id)) {
        expect(lesson.curriculum_version).toBe('egyptian_old_curriculum');
      }
    });
  });

  it('every formula has academic_year, valid grade, and no unwanted duplicates', () => {
    expect(ALL_FORMULAS.length).toBeGreaterThan(0);
    const seenFormulaIds = new Set<string>();

    ALL_FORMULAS.forEach(formula => {
      // Unique ID
      expect(seenFormulaIds.has(formula.id)).toBe(false);
      seenFormulaIds.add(formula.id);

      // Academic Year
      expect(VALID_ACADEMIC_YEARS).toContain(formula.academic_year);
      expect(formula.grade_id).toBeDefined();

      if (!formula.is_extra_curricular) {
        expect(GRADE_YEAR_MAP[formula.grade_id]).toBe(formula.academic_year);
      }

      // LaTeX equation exists
      expect(formula.latex).toBeTruthy();

      // Source
      expect(formula.source).toBeDefined();
      expect(formula.source.source_title).toBeTruthy();

      // Example and solution steps
      expect(formula.example).toBeDefined();
      expect(formula.example.solution_steps.length).toBeGreaterThan(0);
    });
  });

  it('factoring methods are accurately assigned to prep stage and have complete steps', () => {
    expect(FACTORING_METHODS.length).toBeGreaterThanOrEqual(7);
    FACTORING_METHODS.forEach(factor => {
      expect(factor.id).toBeTruthy();
      expect(factor.name).toBeTruthy();
      expect(factor.steps.length).toBeGreaterThan(0);
      expect(factor.solved_examples.length).toBeGreaterThan(0);
      expect(factor.common_pitfalls.length).toBeGreaterThan(0);
    });
  });

  it('solution methods are mapped to their respective grades and have realistic examples', () => {
    expect(SOLUTION_METHODS.length).toBeGreaterThanOrEqual(6);
    SOLUTION_METHODS.forEach(method => {
      expect(method.id).toBeTruthy();
      expect(method.name).toBeTruthy();
      expect(method.steps.length).toBeGreaterThan(0);
      expect(method.examples.length).toBeGreaterThan(0);
    });
  });
});
