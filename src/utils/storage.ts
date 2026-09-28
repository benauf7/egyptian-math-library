import { useState, useEffect } from 'react';
import { getActiveSessionUser, saveUser, User } from './auth-db';

export interface RecentItem {
  id: string;
  type: 'formula' | 'lesson' | 'method' | 'factoring';
  title: string;
  grade_name: string;
  academic_year: string;
  timestamp: number;
}

const FAVORITES_KEY = 'egyptian_math_favorites';
const REVIEWED_KEY = 'egyptian_math_reviewed';
const NEEDS_REVIEW_KEY = 'egyptian_math_needs_review';
const RECENT_KEY = 'egyptian_math_recent_items';
const THEME_KEY = 'egyptian_math_theme';

export interface AuthGuardResult {
  allowed: boolean;
  requiresAuth: boolean;
  message?: string;
  isActionActive?: boolean;
}

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  return getActiveSessionUser() !== null;
};

// Request auth popup if user is a guest
export const triggerAuthPrompt = (actionDesc: string = 'حفظ القوانين وتتبع المراجعة'): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('egyptian_math_auth_required', {
        detail: {
          reason: `يجب تسجيل الدخول أولاً للتمكن من ${actionDesc}!`
        }
      })
    );
  }
};

export const getFavorites = (): string[] => {
  const currentUser = getActiveSessionUser();
  if (currentUser) {
    return currentUser.favorites || [];
  }
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = (id: string): AuthGuardResult => {
  const currentUser = getActiveSessionUser();

  // Strict check: Guests cannot save favorites!
  if (!currentUser) {
    triggerAuthPrompt('حفظ القوانين في مفضلتك الشخصية');
    return {
      allowed: false,
      requiresAuth: true,
      message: 'عذراً! يجب تسجيل الدخول أو إنشاء حساب أولاً لحفظ هذا القانون في مفضلتك.'
    };
  }

  const favs = [...(currentUser.favorites || [])];
  const index = favs.indexOf(id);
  let isFav = false;

  if (index > -1) {
    favs.splice(index, 1);
    isFav = false;
  } else {
    favs.push(id);
    isFav = true;
  }

  currentUser.favorites = favs;
  saveUser(currentUser);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  localStorage.setItem('egyptian_math_current_session', JSON.stringify(currentUser));

  // Dispatch change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egyptian_math_favorites_changed', { detail: favs }));
  }

  return {
    allowed: true,
    requiresAuth: false,
    isActionActive: isFav
  };
};

export const isFavorite = (id: string): boolean => {
  return getFavorites().includes(id);
};

export const getReviewed = (): string[] => {
  const currentUser = getActiveSessionUser();
  if (currentUser) {
    return currentUser.reviewed || [];
  }
  try {
    const data = localStorage.getItem(REVIEWED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleReviewed = (id: string): AuthGuardResult => {
  const currentUser = getActiveSessionUser();

  // Strict check: Guests cannot mark completed reviews!
  if (!currentUser) {
    triggerAuthPrompt('تأكيد المراجعة وتتبع التقدم الدراسي');
    return {
      allowed: false,
      requiresAuth: true,
      message: 'عذراً! يجب تسجيل الدخول أو إنشاء حساب أولاً لوضع علامة المراجعة وتتبع دراستك.'
    };
  }

  const list = [...(currentUser.reviewed || [])];
  const index = list.indexOf(id);
  let isRev = false;

  if (index > -1) {
    list.splice(index, 1);
    isRev = false;
  } else {
    list.push(id);
    isRev = true;
    // Remove from needs review if marked as reviewed
    if (currentUser.needsReview) {
      currentUser.needsReview = currentUser.needsReview.filter(item => item !== id);
    }
  }

  currentUser.reviewed = list;
  saveUser(currentUser);
  localStorage.setItem(REVIEWED_KEY, JSON.stringify(list));
  localStorage.setItem('egyptian_math_current_session', JSON.stringify(currentUser));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egyptian_math_reviewed_changed', { detail: list }));
  }

  return {
    allowed: true,
    requiresAuth: false,
    isActionActive: isRev
  };
};

export const isReviewed = (id: string): boolean => {
  return getReviewed().includes(id);
};

export const getNeedsReview = (): string[] => {
  const currentUser = getActiveSessionUser();
  if (currentUser) {
    return currentUser.needsReview || [];
  }
  try {
    const data = localStorage.getItem(NEEDS_REVIEW_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleNeedsReview = (id: string): AuthGuardResult => {
  const currentUser = getActiveSessionUser();

  if (!currentUser) {
    triggerAuthPrompt('إضافة القوانين لقائمة المراجعة اللاحقة');
    return {
      allowed: false,
      requiresAuth: true,
      message: 'يجب تسجيل الدخول أولاً لتحديد القوانين التي تحتاج مراجعة لاحقة.'
    };
  }

  const list = [...(currentUser.needsReview || [])];
  const index = list.indexOf(id);
  let status = false;

  if (index > -1) {
    list.splice(index, 1);
    status = false;
  } else {
    list.push(id);
    status = true;
  }

  currentUser.needsReview = list;
  saveUser(currentUser);
  localStorage.setItem(NEEDS_REVIEW_KEY, JSON.stringify(list));
  localStorage.setItem('egyptian_math_current_session', JSON.stringify(currentUser));

  return {
    allowed: true,
    requiresAuth: false,
    isActionActive: status
  };
};

export const removeFromNeedsReview = (id: string): void => {
  const currentUser = getActiveSessionUser();
  if (currentUser && currentUser.needsReview) {
    currentUser.needsReview = currentUser.needsReview.filter(item => item !== id);
    saveUser(currentUser);
    localStorage.setItem('egyptian_math_current_session', JSON.stringify(currentUser));
  }
  const list = getNeedsReview().filter(item => item !== id);
  localStorage.setItem(NEEDS_REVIEW_KEY, JSON.stringify(list));
};

export const isNeedsReview = (id: string): boolean => {
  return getNeedsReview().includes(id);
};

export const getRecentItems = (): RecentItem[] => {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentItem = (item: Omit<RecentItem, 'timestamp'>): void => {
  try {
    const recents = getRecentItems().filter(r => r.id !== item.id);
    recents.unshift({
      ...item,
      timestamp: Date.now()
    });
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, 10)));
  } catch (err) {
    console.error('Error saving recent item:', err);
  }
};

export const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light') return theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useUserStorage = () => {
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [reviewed, setReviewed] = useState<string[]>(getReviewed);

  useEffect(() => {
    const handleFavChange = () => setFavorites(getFavorites());
    const handleRevChange = () => setReviewed(getReviewed());
    const handleAuthChange = () => {
      setFavorites(getFavorites());
      setReviewed(getReviewed());
    };

    window.addEventListener('egyptian_math_favorites_changed', handleFavChange);
    window.addEventListener('egyptian_math_reviewed_changed', handleRevChange);
    window.addEventListener('egyptian_math_auth_changed', handleAuthChange);

    return () => {
      window.removeEventListener('egyptian_math_favorites_changed', handleFavChange);
      window.removeEventListener('egyptian_math_reviewed_changed', handleRevChange);
      window.removeEventListener('egyptian_math_auth_changed', handleAuthChange);
    };
  }, []);

  return {
    favorites,
    reviewed,
    isFav: (id: string) => favorites.includes(id),
    isRev: (id: string) => reviewed.includes(id),
    toggleFav: (id: string) => toggleFavorite(id),
    toggleRev: (id: string) => toggleReviewed(id),
  };
};
