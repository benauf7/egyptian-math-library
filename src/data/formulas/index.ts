import { MathFormula } from '../types';
import { PRIMARY_FORMULAS } from './primary_formulas';
import { PREP_FORMULAS } from './prep_formulas';
import { SEC_FORMULAS } from './sec_formulas';
import { EXTRA_FORMULAS } from './extra_formulas';
import { EQUATIONS_FORMULAS } from './equations_formulas';
import { INEQUALITIES_FORMULAS } from './inequalities_formulas';
import { FACTORING_FORMULAS } from './factoring_formulas';
import { ROOTS_EXPONENTS_FORMULAS } from './roots_exponents_formulas';
import { FUNCTIONS_GRAPHS_FORMULAS } from './functions_graphs_formulas';
import { PRIMARY_FOUNDATIONS_FORMULAS } from './primary_foundations_formulas';

export const ALL_FORMULAS: MathFormula[] = [
  ...PRIMARY_FORMULAS,
  ...PRIMARY_FOUNDATIONS_FORMULAS,
  ...PREP_FORMULAS,
  ...SEC_FORMULAS,
  ...EQUATIONS_FORMULAS,
  ...INEQUALITIES_FORMULAS,
  ...FACTORING_FORMULAS,
  ...ROOTS_EXPONENTS_FORMULAS,
  ...FUNCTIONS_GRAPHS_FORMULAS,
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

export {
  PRIMARY_FORMULAS,
  PRIMARY_FOUNDATIONS_FORMULAS,
  PREP_FORMULAS,
  SEC_FORMULAS,
  EXTRA_FORMULAS,
  EQUATIONS_FORMULAS,
  INEQUALITIES_FORMULAS,
  FACTORING_FORMULAS,
  ROOTS_EXPONENTS_FORMULAS,
  FUNCTIONS_GRAPHS_FORMULAS
};
