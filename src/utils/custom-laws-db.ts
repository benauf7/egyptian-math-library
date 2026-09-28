import { MathFormula } from '../data/types';
import { ALL_FORMULAS } from '../data/formulas';

const CUSTOM_FORMULAS_KEY = 'egyptian_math_custom_formulas';
const DELETED_FORMULAS_KEY = 'egyptian_math_deleted_formula_ids';
const OVERRIDDEN_FORMULAS_KEY = 'egyptian_math_overridden_formulas';

// Helper for localStorage access
const getStoredJson = <T>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredJson = <T>(key: string, value: T): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('egyptian_math_formulas_changed'));
    }
  } catch (e) {
    console.error('Storage error for formulas:', e);
  }
};

export const getCustomFormulas = (): MathFormula[] => {
  return getStoredJson<MathFormula[]>(CUSTOM_FORMULAS_KEY, []);
};

export const getDeletedFormulaIds = (): string[] => {
  return getStoredJson<string[]>(DELETED_FORMULAS_KEY, []);
};

export const getOverriddenFormulas = (): Record<string, MathFormula> => {
  return getStoredJson<Record<string, MathFormula>>(OVERRIDDEN_FORMULAS_KEY, {});
};

// Returns all active formulas: Built-in + Custom + Overridden (excluding deleted)
export const getAllActiveFormulas = (): MathFormula[] => {
  const custom = getCustomFormulas();
  const deletedIds = new Set(getDeletedFormulaIds());
  const overrides = getOverriddenFormulas();

  // Process built-in formulas
  const processedBuiltIn = ALL_FORMULAS
    .filter(f => !deletedIds.has(f.id))
    .map(f => (overrides[f.id] ? overrides[f.id] : f));

  // Filter custom (in case any custom was marked deleted)
  const activeCustom = custom.filter(f => !deletedIds.has(f.id));

  return [...activeCustom, ...processedBuiltIn];
};

// Save a new or edited formula
export const saveFormula = (formula: MathFormula): void => {
  const isBuiltIn = ALL_FORMULAS.some(f => f.id === formula.id);

  if (isBuiltIn) {
    // Save as override
    const overrides = getOverriddenFormulas();
    overrides[formula.id] = formula;
    setStoredJson(OVERRIDDEN_FORMULAS_KEY, overrides);
  } else {
    // Save as custom formula
    const custom = getCustomFormulas();
    const existingIdx = custom.findIndex(f => f.id === formula.id);
    if (existingIdx > -1) {
      custom[existingIdx] = formula;
    } else {
      custom.unshift(formula);
    }
    setStoredJson(CUSTOM_FORMULAS_KEY, custom);
  }

  // Ensure it's not marked as deleted
  const deleted = getDeletedFormulaIds().filter(id => id !== formula.id);
  setStoredJson(DELETED_FORMULAS_KEY, deleted);
};

// Delete or hide a formula
export const removeFormula = (formulaId: string): void => {
  // If custom, remove from custom list
  const custom = getCustomFormulas().filter(f => f.id !== formulaId);
  setStoredJson(CUSTOM_FORMULAS_KEY, custom);

  // If built-in or overridden, add to deleted blacklist
  const deleted = getDeletedFormulaIds();
  if (!deleted.includes(formulaId)) {
    deleted.push(formulaId);
    setStoredJson(DELETED_FORMULAS_KEY, deleted);
  }

  // Remove any overrides
  const overrides = getOverriddenFormulas();
  if (overrides[formulaId]) {
    delete overrides[formulaId];
    setStoredJson(OVERRIDDEN_FORMULAS_KEY, overrides);
  }
};

// Reset all customizations to default built-in
export const resetFormulasToDefault = (): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(CUSTOM_FORMULAS_KEY);
  localStorage.removeItem(DELETED_FORMULAS_KEY);
  localStorage.removeItem(OVERRIDDEN_FORMULAS_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egyptian_math_formulas_changed'));
  }
};
