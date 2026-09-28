import { MathFormula } from '../types';
import { PRIMARY_FORMULAS } from './primary_formulas';
import { PREP_FORMULAS } from './prep_formulas';
import { SEC_FORMULAS } from './sec_formulas';
import { EXTRA_FORMULAS } from './extra_formulas';

export const ALL_FORMULAS: MathFormula[] = [
  ...PRIMARY_FORMULAS,
  ...PREP_FORMULAS,
  ...SEC_FORMULAS,
  ...EXTRA_FORMULAS
];

export const getFormulaById = (id: string): MathFormula | undefined => {
  return ALL_FORMULAS.find(f => f.id === id);
};

export const getFormulasByGrade = (gradeId: string): MathFormula[] => {
  return ALL_FORMULAS.filter(f => f.grade_id === gradeId);
};

export const getFormulasByYear = (academicYear: string): MathFormula[] => {
  return ALL_FORMULAS.filter(f => f.academic_year === academicYear);
};
