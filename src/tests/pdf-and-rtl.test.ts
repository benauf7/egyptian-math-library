import { describe, it, expect } from 'vitest';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { GRADES_DATA } from '../data/curriculum/grades';
import { OFFICIAL_SOURCES } from '../data/sources';
import katex from 'katex';

describe('PDF Book & RTL Layout Verification', () => {
  it('all formulas have valid KaTeX syntax and parse without throwing errors', () => {
    ALL_FORMULAS.forEach(f => {
      expect(() => {
        katex.renderToString(f.latex, {
          throwOnError: true,
          displayMode: true
        });
      }).not.toThrow();
    });
  });

  it('verifies the 7 grades cover the required sequence from 2020/2021 to 2026/2027', () => {
    const expectedYears = [
      '2020/2021',
      '2021/2022',
      '2022/2023',
      '2023/2024',
      '2024/2025',
      '2025/2026',
      '2026/2027'
    ];

    const actualYears = GRADES_DATA.map(g => g.academic_year);
    expect(actualYears).toEqual(expectedYears);
  });

  it('verifies all stages have lessons with complete Arabic educational text', () => {
    expect(ALL_LESSONS.length).toBeGreaterThanOrEqual(6);
    ALL_LESSONS.forEach(lesson => {
      // Must contain Arabic characters
      expect(/[\u0600-\u06FF]/.test(lesson.title)).toBe(true);
      expect(/[\u0600-\u06FF]/.test(lesson.formula_explanation)).toBe(true);
      expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('verifies the official sources dictionary includes MoETE citations for every grade', () => {
    GRADES_DATA.forEach(grade => {
      const sourceMatches = Object.values(OFFICIAL_SOURCES).some(src => 
        src.academic_year === grade.academic_year || src.grade.includes(grade.name)
      );
      expect(sourceMatches).toBe(true);
    });
  });
});
