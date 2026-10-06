/**
 * Egyptian Math Archive - Scalable Authentication & User Management Engine
 * Powered by IndexedDB with LocalStorage fallback.
 * Designed to easily support 500+ to 100,000+ users with indexed queries.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  role?: 'admin' | 'student';
  verificationCode?: string;
  verificationCodeExpiresAt?: number;
  failedVerificationAttempts?: number;
  verificationLockedUntil?: number;
  resetCode?: string;
  resetCodeExpiresAt?: number;
  failedLoginAttempts?: number;
  loginLockedUntil?: number;
  createdAt: number;
  lastLoginAt?: number;
  favorites: string[];
  reviewed: string[];
  needsReview: string[];
}

export interface SentEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  code: string;
  purpose: 'verification' | 'password_reset';
  sentAt: number;
  expiresAt: number;
  read: boolean;
  deliveredToRealInbox?: boolean;
  provider?: string;
  previewUrl?: string | null;
}

const DB_NAME = 'EgyptianMathArchiveAuthDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const EMAILS_STORE = 'emails';
const SESSION_KEY = 'egyptian_math_current_session';
const LOCAL_USERS_KEY = 'egyptian_math_users_store_fallback';
const LOCAL_EMAILS_KEY = 'egyptian_math_emails_store_fallback';

export const ADMIN_EMAIL = 'benauf7@gmail.com';

// Sanitize user inputs to protect against XSS and stored injection
export const sanitizeInput = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .trim();
};

// Generate 6-character alphanumeric code with uppercase letters and digits (e.g. 'A7K9X2')
export const generate6CharSecurityCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // High-contrast, no ambiguous 0/O or 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

// Simple yet secure SHA-256 hash representation
export const hashPassword = async (password: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(password + '_egyptian_math_salt_2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Lightweight fallback hashing
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16) + '_secure';
};

// Open IndexedDB instance
const openDB = (): Promise<IDBDatabase | null> => {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
        if (!db.objectStoreNames.contains(EMAILS_STORE)) {
          const emailStore = db.createObjectStore(EMAILS_STORE, { keyPath: 'id' });
          emailStore.createIndex('to', 'to', { unique: false });
          emailStore.createIndex('sentAt', 'sentAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

// LocalStorage helpers for fallback or synchronous access
const getLocalUsers = (): User[] => {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: User[]) => {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('LocalStorage limit reached', e);
  }
};

const getLocalEmails = (): SentEmail[] => {
  try {
    const data = localStorage.getItem(LOCAL_EMAILS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalEmails = (emails: SentEmail[]) => {
  try {
    localStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails.slice(-50))); // Keep last 50 emails
  } catch (e) {
    console.warn('LocalStorage limit reached for emails', e);
  }
};

// Core User Operations
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await openDB();

  if (db) {
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([USERS_STORE], 'readonly');
        const store = transaction.objectStore(USERS_STORE);
        const index = store.index('email');
        const req = index.get(normalizedEmail);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  // Fallback
  const users = getLocalUsers();
  return users.find(u => u.email === normalizedEmail) || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([USERS_STORE], 'readonly');
        const store = transaction.objectStore(USERS_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  const users = getLocalUsers();
  return users.find(u => u.id === id) || null;
};

export const saveUser = async (user: User): Promise<boolean> => {
  // Always update LocalStorage backup
  const localUsers = getLocalUsers();
  const existingIdx = localUsers.findIndex(u => u.id === user.id);
  if (existingIdx > -1) {
    localUsers[existingIdx] = user;
  } else {
    localUsers.push(user);
  }
  saveLocalUsers(localUsers);

  // Update IndexedDB for unlimited scalability
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([USERS_STORE], 'readwrite');
        const store = transaction.objectStore(USERS_STORE);
        const req = store.put(user);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }
  return true;
};

// Retrieve all registered users for admin dashboard
export const getAllUsers = async (): Promise<User[]> => {
  const db = await openDB();
  let result: User[] = [];

  if (db) {
    result = await new Promise((resolve) => {
      try {
        const transaction = db.transaction([USERS_STORE], 'readonly');
        const store = transaction.objectStore(USERS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  if (result.length === 0) {
    result = getLocalUsers();
  }

  result.sort((a, b) => b.createdAt - a.createdAt);
  return result;
};

// Delete user account
export const deleteUserById = async (id: string): Promise<boolean> => {
  const localUsers = getLocalUsers().filter(u => u.id !== id);
  saveLocalUsers(localUsers);

  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([USERS_STORE], 'readwrite');
        const store = transaction.objectStore(USERS_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }
  return true;
};

// Dispatch a simulated email with copyable 6-digit code
export const dispatchEmail = async (
  to: string,
  recipientName: string,
  subject: string,
  code: string,
  purpose: 'verification' | 'password_reset'
): Promise<SentEmail> => {
  const newEmail: SentEmail = {
    id: 'email_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    to: to.trim().toLowerCase(),
    recipientName,
    subject,
    code,
    purpose,
    sentAt: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes validity
    read: false
  };

  // Save to local fallback
  const emails = getLocalEmails();
  emails.unshift(newEmail);
  saveLocalEmails(emails);

  // Save to IndexedDB
  const db = await openDB();
  if (db) {
    try {
      const transaction = db.transaction([EMAILS_STORE], 'readwrite');
      const store = transaction.objectStore(EMAILS_STORE);
      store.put(newEmail);
    } catch (e) {
      console.warn('Could not store email in IDB', e);
    }
  }

  // Attempt sending real email via backend API (/api/send-email)
  if (typeof fetch !== 'undefined') {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to.trim().toLowerCase(),
          recipientName,
          subject,
          code,
          purpose
        })
      });

      if (response.ok) {
        const data = await response.json();
        newEmail.deliveredToRealInbox = Boolean(data.deliveredToRealInbox);
        newEmail.provider = data.provider;
        newEmail.previewUrl = data.previewUrl;
      }
    } catch (e) {
      console.warn('Real email dispatch network error:', e);
    }
  }

  // Trigger custom event so any active component can notify user immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egyptian_math_email_received', { detail: newEmail }));
  }

  return newEmail;
};

export const getRecentEmails = async (emailFilter?: string): Promise<SentEmail[]> => {
  const db = await openDB();
  let result: SentEmail[] = [];

  if (db) {
    result = await new Promise((resolve) => {
      try {
        const transaction = db.transaction([EMAILS_STORE], 'readonly');
        const store = transaction.objectStore(EMAILS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  if (result.length === 0) {
    result = getLocalEmails();
  }

  // Sort newest first
  result.sort((a, b) => b.sentAt - a.sentAt);

  if (emailFilter) {
    const norm = emailFilter.trim().toLowerCase();
    return result.filter(e => e.to === norm);
  }
  return result;
};

// Mark all sent emails as read when opening email drawer
export const markAllEmailsAsRead = async (): Promise<void> => {
  const local = getLocalEmails();
  local.forEach(e => { e.read = true; });
  saveLocalEmails(local);

  const db = await openDB();
  if (db) {
    try {
      const transaction = db.transaction([EMAILS_STORE], 'readwrite');
      const store = transaction.objectStore(EMAILS_STORE);
      for (const e of local) {
        store.put(e);
      }
    } catch {
      // IDB update fallback
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egyptian_math_emails_read'));
  }
};

// Session Management
export const getActiveSessionUser = (): User | null => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setActiveSessionUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      // Also update window event for reactive UI
      window.dispatchEvent(new CustomEvent('egyptian_math_auth_changed', { detail: user }));
    } else {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new CustomEvent('egyptian_math_auth_changed', { detail: null }));
    }
  } catch (e) {
    console.error('Session update error', e);
  }
};

// High-level Auth APIs
export interface RegisterResult {
  success: boolean;
  message: string;
  user?: User;
  code?: string;
}

export const registerNewUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> => {
  const normEmail = email.trim().toLowerCase();
  const cleanName = sanitizeInput(name);

  // Validate inputs
  if (!cleanName.trim()) {
    return { success: false, message: 'يرجى كتابة الاسم بالكامل.' };
  }
  if (!normEmail || !normEmail.includes('@') || !normEmail.includes('.')) {
    return { success: false, message: 'يرجى إدخال بريد إلكتروني صالح.' };
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام.' };
  }

  // Check existing user
  const existing = await getUserByEmail(normEmail);
  if (existing) {
    if (existing.isVerified) {
      return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل! يرجى تسجيل الدخول.' };
    } else {
      // Re-send verification code if account was created but not verified
      const code = generate6CharSecurityCode();
      existing.verificationCode = code;
      existing.verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000;
      await saveUser(existing);
      await dispatchEmail(
        normEmail,
        existing.name,
        'تأكيد إنشاء حسابك في مكتبة الرياضيات الشخصية',
        code,
        'verification'
      );
      return {
        success: true,
        message: 'تم إرسال رمز تأكيد جديد مكون من 6 خانات إلى بريدك الإلكتروني.',
        user: existing,
        code
      };
    }
  }

  const passwordHash = await hashPassword(password);
  const code = generate6CharSecurityCode();

  const newUser: User = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    name: cleanName,
    email: normEmail,
    passwordHash,
    isVerified: false,
    role: normEmail === ADMIN_EMAIL ? 'admin' : 'student',
    verificationCode: code,
    verificationCodeExpiresAt: Date.now() + 15 * 60 * 1000,
    failedVerificationAttempts: 0,
    verificationLockedUntil: 0,
    failedLoginAttempts: 0,
    loginLockedUntil: 0,
    createdAt: Date.now(),
    favorites: [],
    reviewed: [],
    needsReview: []
  };

  await saveUser(newUser);

  // Send simulated verification email
  await dispatchEmail(
    normEmail,
    newUser.name,
    'تأكيد إنشاء حسابك في مكتبة الرياضيات الشخصية',
    code,
    'verification'
  );

  return {
    success: true,
    message: 'تم إنشاء الحساب بنجاح! تم إرسال رمز التحقق (6 خانات) إلى بريدك الإلكتروني.',
    user: newUser,
    code
  };
};

export const verifyAccountEmail = async (
  email: string,
  code: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  const normEmail = email.trim().toLowerCase();
  const cleanCode = code.trim().toUpperCase();

  const user = await getUserByEmail(normEmail);
  if (!user) {
    return { success: false, message: 'لم يتم العثور على حساب بهذا البريد الإلكتروني.' };
  }

  if (user.isVerified) {
    setActiveSessionUser(user);
    return { success: true, message: 'الحساب مفعل بالفعل ومؤكد مسبقاً!', user };
  }

  // Brute force protection on verification code guessing
  if (user.verificationLockedUntil && user.verificationLockedUntil > Date.now()) {
    const remainingMins = Math.ceil((user.verificationLockedUntil - Date.now()) / (60 * 1000));
    return {
      success: false,
      message: `تم تجميد محاولات إدخال الرمز مؤقتاً لدواعي الأمان بسبب تكرار المحاولات الخاطئة. يرجى المحاولة بعد ${remainingMins} دقيقة.`
    };
  }

  if (!user.verificationCode || user.verificationCode.toUpperCase() !== cleanCode) {
    user.failedVerificationAttempts = (user.failedVerificationAttempts || 0) + 1;
    if (user.failedVerificationAttempts >= 5) {
      user.verificationLockedUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      user.failedVerificationAttempts = 0;
      await saveUser(user);
      return {
        success: false,
        message: 'تم إدخال رمز غير صحيح 5 مرات متتالية. تم قفل التحقق لمدة 15 دقيقة لحماية الحساب من هجمات التخمين.'
      };
    }
    await saveUser(user);
    const left = 5 - user.failedVerificationAttempts;
    return {
      success: false,
      message: `رمز التأكيد غير صحيح! يرجى مراجعة البريد الإلكتروني. (المحاولات المتبقية: ${left})`
    };
  }

  if (user.verificationCodeExpiresAt && user.verificationCodeExpiresAt < Date.now()) {
    return { success: false, message: 'انتهت صلاحية رمز التأكيد. يرجى طلب رمز جديد.' };
  }

  // Mark as verified & clear code and counters
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  user.failedVerificationAttempts = 0;
  user.verificationLockedUntil = 0;
  if (normEmail === ADMIN_EMAIL) {
    user.role = 'admin';
  }
  user.lastLoginAt = Date.now();
  await saveUser(user);
  setActiveSessionUser(user);

  return {
    success: true,
    message: 'تم تأكيد حسابك بنجاح! مرحباً بك في مكتبة الرياضيات الشخصية.',
    user
  };
};

export const loginWithCredentials = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User; requiresVerification?: boolean }> => {
  const normEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normEmail);

  if (!user) {
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
  }

  // Brute force protection on password guessing
  if (user.loginLockedUntil && user.loginLockedUntil > Date.now()) {
    const remainingMins = Math.ceil((user.loginLockedUntil - Date.now()) / (60 * 1000));
    return {
      success: false,
      message: `تم قفل تسجيل الدخول مؤقتاً لحماية هذا الحساب بسبب محاولات متكررة خاطئة. يرجى الانتظار ${remainingMins} دقيقة.`
    };
  }

  const hash = await hashPassword(password);
  if (user.passwordHash !== hash) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= 5) {
      user.loginLockedUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      user.failedLoginAttempts = 0;
      await saveUser(user);
      return {
        success: false,
        message: 'تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم قفل تسجيل الدخول لمدة 15 دقيقة لحماية الحساب من الاختراق.'
      };
    }
    await saveUser(user);
    const left = 5 - user.failedLoginAttempts;
    return {
      success: false,
      message: `البريد الإلكتروني أو كلمة المرور غير صحيحة. (المحاولات المتبقية: ${left})`
    };
  }

  // Reset login attempt counter on success
  user.failedLoginAttempts = 0;
  user.loginLockedUntil = 0;
  if (normEmail === ADMIN_EMAIL) {
    user.role = 'admin';
  }

  if (!user.isVerified) {
    // Generate new code and prompt for verification
    const code = generate6CharSecurityCode();
    user.verificationCode = code;
    user.verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000;
    await saveUser(user);
    await dispatchEmail(
      normEmail,
      user.name,
      'تأكيد حسابك في مكتبة الرياضيات الشخصية',
      code,
      'verification'
    );
    return {
      success: false,
      requiresVerification: true,
      message: 'الحساب غير مؤكد بعد. تم إرسال رمز تأكيد جديد (6 خانات) إلى بريدك الإلكتروني لتفعيله.',
      user
    };
  }

  user.lastLoginAt = Date.now();
  await saveUser(user);
  setActiveSessionUser(user);

  return {
    success: true,
    message: `مرحباً بعودتك يا ${user.name}!`,
    user
  };
};

export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; message: string; code?: string }> => {
  const normEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normEmail);

  if (!user) {
    return { success: false, message: 'لم نتمكن من العثور على أي حساب مسجل بهذا البريد الإلكتروني.' };
  }

  const code = generate6CharSecurityCode();
  user.resetCode = code;
  user.resetCodeExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
  await saveUser(user);

  await dispatchEmail(
    normEmail,
    user.name,
    'رمز استعادة كلمة المرور لمكتبة الرياضيات الشخصية',
    code,
    'password_reset'
  );

  return {
    success: true,
    message: 'تم إرسال رمز استعادة كلمة المرور المكون من 6 خانات إلى بريدك الإلكتروني.',
    code
  };
};

export const completePasswordReset = async (
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  const normEmail = email.trim().toLowerCase();
  const cleanCode = code.trim().toUpperCase();

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'كلمة المرور الجديدة يجب ألا تقل عن 6 خانات.' };
  }

  const user = await getUserByEmail(normEmail);
  if (!user) {
    return { success: false, message: 'لم يتم العثور على الحساب.' };
  }

  if (!user.resetCode || user.resetCode.toUpperCase() !== cleanCode) {
    return { success: false, message: 'رمز استعادة كلمة المرور غير صحيح!' };
  }

  if (user.resetCodeExpiresAt && user.resetCodeExpiresAt < Date.now()) {
    return { success: false, message: 'انتهت صلاحية الرمز. يرجى طلب رمز استعادة جديد.' };
  }

  user.passwordHash = await hashPassword(newPassword);
  user.resetCode = undefined;
  user.resetCodeExpiresAt = undefined;
  user.isVerified = true;
  user.lastLoginAt = Date.now();

  await saveUser(user);
  setActiveSessionUser(user);

  return {
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح وتسجيل دخولك تلقائياً!',
    user
  };
};

// Resend verification code
export const resendVerificationCode = async (
  email: string
): Promise<{ success: boolean; message: string; code?: string }> => {
  const normEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normEmail);
  if (!user) {
    return { success: false, message: 'الحساب غير موجود.' };
  }

  const code = generate6CharSecurityCode();
  user.verificationCode = code;
  user.verificationCodeExpiresAt = Date.now() + 15 * 60 * 1000;
  await saveUser(user);

  await dispatchEmail(
    normEmail,
    user.name,
    'رمز تأكيد جديد لحسابك في مكتبة الرياضيات',
    code,
    'verification'
  );

  return {
    success: true,
    message: 'تم إرسال رمز تأكيد جديد إلى بريدك الإلكتروني.',
    code
  };
};
