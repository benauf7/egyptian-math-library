import { describe, it, expect } from 'vitest';
import { ALL_FORMULAS } from '../data/formulas';
import { ALL_LESSONS } from '../data/lessons';
import { FACTORING_METHODS } from '../data/factoring';

describe('Search & Filter Engine Tests', () => {
  it('searches formulas in Arabic accurately (e.g., فرق المربعين, محيط, فيثاغورس)', () => {
    const q1 = 'فرق المربعين';
    const res1 = ALL_FORMULAS.filter(f => f.name.includes(q1) || f.meaning_explanation.includes(q1));
    expect(res1.length).toBeGreaterThan(0);
    expect(res1.some(f => f.id === 'form_prep2_diff_squares')).toBe(true);

    const q2 = 'فيثاغورس';
    const res2 = ALL_FORMULAS.filter(f => f.name.includes(q2) || f.meaning_explanation.includes(q2));
    expect(res2.length).toBeGreaterThan(0);
    expect(res2.some(f => f.id === 'form_prep1_pythagoras')).toBe(true);
  });

  it('searches formulas in English notation and names (e.g., Pythagoras, Discriminant, Quadratic)', () => {
    const q = 'discriminant';
    const res = ALL_FORMULAS.filter(f => f.name_en?.toLowerCase().includes(q));
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].id).toBe('form_sec1_discriminant');
  });

  it('searches and filters by LaTeX symbols (e.g., \\pi, \\Delta, a^2 - b^2)', () => {
    const q = '\\pi';
    const res = ALL_FORMULAS.filter(f => f.latex.includes(q));
    expect(res.length).toBeGreaterThanOrEqual(2); // Circumference and Area of circle
  });

  it('filters by Stage and Grade correctly without mixing stages', () => {
    const primaryFormulas = ALL_FORMULAS.filter(f => f.stage_id === 'primary');
    const prepFormulas = ALL_FORMULAS.filter(f => f.stage_id === 'prep');
    const secFormulas = ALL_FORMULAS.filter(f => f.stage_id === 'secondary');

    expect(primaryFormulas.length).toBeGreaterThan(0);
    expect(prepFormulas.length).toBeGreaterThan(0);
    expect(secFormulas.length).toBeGreaterThan(0);

    // Verify disjoint sets
    primaryFormulas.forEach(f => {
      expect(['primary_4', 'primary_5', 'primary_6']).toContain(f.grade_id);
      expect(f.stage_id).toBe('primary');
    });

    prepFormulas.forEach(f => {
      expect(['prep_1', 'prep_2', 'prep_3']).toContain(f.grade_id);
      expect(f.stage_id).toBe('prep');
    });
  });

  it('correctly isolates extra-curricular formulas from school curriculum', () => {
    const extraFormulas = ALL_FORMULAS.filter(f => f.is_extra_curricular);
    expect(extraFormulas.length).toBeGreaterThan(0);
    extraFormulas.forEach(f => {
      expect(f.curriculum_version).toBe('extra_curricular');
      expect(f.grade_name).toContain('إضافات');
    });

    const standardFormulas = ALL_FORMULAS.filter(f => !f.is_extra_curricular);
    standardFormulas.forEach(f => {
      expect(f.curriculum_version).not.toBe('extra_curricular');
    });
  });

  it('filters factoring methods exclusively from the proper grades', () => {
    const factoringFormulas = ALL_FORMULAS.filter(f => f.is_factoring);
    expect(factoringFormulas.length).toBeGreaterThan(0);
    factoringFormulas.forEach(f => {
      expect(['prep_1', 'prep_2']).toContain(f.grade_id);
    });
  });
});
