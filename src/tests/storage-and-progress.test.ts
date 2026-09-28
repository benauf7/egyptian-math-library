import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getFavorites, 
  toggleFavorite, 
  isFavorite, 
  getReviewed, 
  toggleReviewed, 
  isReviewed,
  getNeedsReview,
  toggleNeedsReview,
  isNeedsReview,
  getRecentItems,
  addRecentItem
} from '../utils/storage';
import { setActiveSessionUser, User } from '../utils/auth-db';

// Mock localStorage for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

const mockUser: User = {
  id: 'usr_test_123',
  name: 'أحمد محمود',
  email: 'ahmed@test.com',
  passwordHash: 'dummyhash',
  isVerified: true,
  createdAt: Date.now(),
  favorites: [],
  reviewed: [],
  needsReview: []
};

describe('LocalStorage & Personal Review Tracker', () => {
  beforeEach(() => {
    localStorageMock.clear();
    setActiveSessionUser(null); // start as guest
  });

  it('protects guest from saving favorites and requires login', () => {
    const res = toggleFavorite('item_guest');
    expect(res.allowed).toBe(false);
    expect(res.requiresAuth).toBe(true);
    expect(isFavorite('item_guest')).toBe(false);
  });

  it('protects guest from marking reviewed and requires login', () => {
    const res = toggleReviewed('item_guest_rev');
    expect(res.allowed).toBe(false);
    expect(res.requiresAuth).toBe(true);
    expect(isReviewed('item_guest_rev')).toBe(false);
  });

  it('toggles favorites correctly when user is authenticated', () => {
    setActiveSessionUser({ ...mockUser, favorites: [] });
    expect(isFavorite('item_1')).toBe(false);
    
    const added = toggleFavorite('item_1');
    expect(added.allowed).toBe(true);
    expect(added.isActionActive).toBe(true);
    expect(isFavorite('item_1')).toBe(true);
    expect(getFavorites()).toContain('item_1');

    const removed = toggleFavorite('item_1');
    expect(removed.allowed).toBe(true);
    expect(removed.isActionActive).toBe(false);
    expect(isFavorite('item_1')).toBe(false);
  });

  it('toggles reviewed status and clears needs-review flag when authenticated', () => {
    setActiveSessionUser({ ...mockUser, reviewed: [], needsReview: [] });
    toggleNeedsReview('item_2');
    expect(isNeedsReview('item_2')).toBe(true);

    const markReviewed = toggleReviewed('item_2');
    expect(markReviewed.allowed).toBe(true);
    expect(markReviewed.isActionActive).toBe(true);
    expect(isReviewed('item_2')).toBe(true);
    // Needs review should be cleared automatically
    expect(isNeedsReview('item_2')).toBe(false);
  });

  it('tracks recent viewed items with maximum capacity of 10', () => {
    for (let i = 1; i <= 15; i++) {
      addRecentItem({
        id: `recent_${i}`,
        type: 'formula',
        title: `Formula ${i}`,
        grade_name: 'الصف الرابع الابتدائي',
        academic_year: '2020/2021'
      });
    }

    const items = getRecentItems();
    expect(items.length).toBe(10);
    expect(items[0].id).toBe('recent_15');
  });

  it('allows admin to add, update, and remove custom math laws', async () => {
    const { saveFormula, removeFormula, getAllActiveFormulas, getCustomFormulas } = await import('../utils/custom-laws-db');
    
    const initialFormulas = getAllActiveFormulas();
    const testFormula = {
      id: 'custom_rule_test_1',
      name: 'قانون مخصص تجريبي',
      latex: 'س^2 + ص^2 = ع^2',
      grade_id: 'sec_1' as const,
      grade_name: 'الصف الأول الثانوي',
      stage_id: 'secondary' as const,
      academic_year: '2026/2027' as const,
      curriculum_version: 'egyptian_restructured_2024_2027' as const,
      branch: 'جبر',
      unit_name: 'الوحدة الأولى',
      topic: 'المعادلات',
      symbol_definitions: [],
      meaning_explanation: 'قانون مضاف من لوحة التحكم',
      when_to_use: [],
      solution_steps: [],
      example: {
        problem: 'حل المعادلة',
        solution_steps: ['خطوة 1'],
        answer: 'س = 5'
      },
      notes: [],
      source: {
        source_title: 'إشراف بن عوف',
        academic_year: '2026/2027' as const,
        grade: 'الصف الأول الثانوي',
        curriculum_version: 'egyptian_restructured_2024_2027' as const,
        official_publisher: 'مكتبة الرياضيات'
      }
    };

    saveFormula(testFormula);
    const customList = getCustomFormulas();
    expect(customList.some(f => f.id === 'custom_rule_test_1')).toBe(true);

    const updatedFormulas = getAllActiveFormulas();
    expect(updatedFormulas.length).toBe(initialFormulas.length + 1);

    // Remove formula
    removeFormula('custom_rule_test_1');
    const afterRemoval = getAllActiveFormulas();
    expect(afterRemoval.some(f => f.id === 'custom_rule_test_1')).toBe(false);
  });
});
