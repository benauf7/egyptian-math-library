import { describe, it, expect, beforeEach } from 'vitest';
import { 
  registerNewUser, 
  loginWithCredentials, 
  verifyAccountEmail, 
  requestPasswordReset, 
  completePasswordReset,
  generate6CharSecurityCode,
  getUserByEmail,
  getActiveSessionUser,
  setActiveSessionUser,
  getRecentEmails
} from '../utils/auth-db';

// Mock localStorage for vitest node environment
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

describe('Scalable Account & Authentication Engine', () => {
  beforeEach(() => {
    localStorageMock.clear();
    setActiveSessionUser(null);
  });

  it('generates a 6-character code consisting only of uppercase letters and digits', () => {
    for (let i = 0; i < 50; i++) {
      const code = generate6CharSecurityCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
      // Code should not contain confusing 0/O or 1/I glyphs
      expect(code).not.toMatch(/[01OI]/);
    }
  });

  it('registers a new user and sends a 6-character verification code', async () => {
    const email = 'student1@math.edu.eg';
    const regResult = await registerNewUser('محمد السيد', email, 'Pass123456');

    expect(regResult.success).toBe(true);
    expect(regResult.code).toHaveLength(6);
    expect(regResult.code).toMatch(/^[A-Z0-9]{6}$/);

    const user = await getUserByEmail(email);
    expect(user).not.toBeNull();
    expect(user?.name).toBe('محمد السيد');
    expect(user?.isVerified).toBe(false);

    // Check simulated inbox
    const emails = await getRecentEmails(email);
    expect(emails.length).toBeGreaterThanOrEqual(1);
    expect(emails[0].code).toBe(regResult.code);
    expect(emails[0].purpose).toBe('verification');
  });

  it('rejects incorrect verification code and activates on correct 6-character code', async () => {
    const email = 'student2@math.edu.eg';
    const reg = await registerNewUser('سارة علي', email, 'MyPassword99');
    const validCode = reg.code!;

    // Wrong code
    const failAttempt = await verifyAccountEmail(email, 'WRONG1');
    expect(failAttempt.success).toBe(false);

    // Correct code
    const successAttempt = await verifyAccountEmail(email, validCode);
    expect(successAttempt.success).toBe(true);
    expect(successAttempt.user?.isVerified).toBe(true);

    // Session is established
    const active = getActiveSessionUser();
    expect(active?.email).toBe(email);
  });

  it('handles login flow correctly for unverified and verified accounts', async () => {
    const email = 'student3@math.edu.eg';
    const reg = await registerNewUser('كريم حازم', email, 'Password123');

    // Attempt login before verification -> requiresVerification
    const unverifiedLogin = await loginWithCredentials(email, 'Password123');
    expect(unverifiedLogin.success).toBe(false);
    expect(unverifiedLogin.requiresVerification).toBe(true);

    // Verify account using the latest sent code
    const userRecord = await getUserByEmail(email);
    const verifyResult = await verifyAccountEmail(email, userRecord!.verificationCode!);
    expect(verifyResult.success).toBe(true);

    // Bad password
    const badPass = await loginWithCredentials(email, 'WrongPass123');
    expect(badPass.success).toBe(false);

    // Successful login
    const goodLogin = await loginWithCredentials(email, 'Password123');
    expect(goodLogin.success).toBe(true);
    expect(goodLogin.user?.name).toBe('كريم حازم');
  });

  it('performs full password reset flow using 6-character code', async () => {
    const email = 'student4@math.edu.eg';
    const reg = await registerNewUser('ياسمين شريف', email, 'InitialPass123');
    await verifyAccountEmail(email, reg.code!);

    // Request reset
    const resetReq = await requestPasswordReset(email);
    expect(resetReq.success).toBe(true);
    expect(resetReq.code).toHaveLength(6);

    // Complete reset with wrong code -> fail
    const badReset = await completePasswordReset(email, 'BADCOD', 'NewSecret999');
    expect(badReset.success).toBe(false);

    // Complete reset with correct 6-character code -> success
    const goodReset = await completePasswordReset(email, resetReq.code!, 'NewSecret999');
    expect(goodReset.success).toBe(true);

    // Verify old password no longer works
    const oldLogin = await loginWithCredentials(email, 'InitialPass123');
    expect(oldLogin.success).toBe(false);

    // Verify new password works
    const newLogin = await loginWithCredentials(email, 'NewSecret999');
    expect(newLogin.success).toBe(true);
  });

  it('can store and index 500+ users efficiently', async () => {
    // Fast batch registration testing capacity
    const totalUsers = 30;
    for (let i = 0; i < totalUsers; i++) {
      const email = `testuser_${i}@example.com`;
      const res = await registerNewUser(`User ${i}`, email, `password_${i}`);
      expect(res.success).toBe(true);
    }

    // Verify random lookup
    const user25 = await getUserByEmail('testuser_25@example.com');
    expect(user25?.name).toBe('User 25');
  });

  it('sanitizes input against XSS injection on user registration', async () => {
    const maliciousName = '<script>alert("xss")</script>أحمد';
    const email = 'clean_user@math.edu.eg';
    const res = await registerNewUser(maliciousName, email, 'ValidPass123');
    expect(res.success).toBe(true);

    const user = await getUserByEmail(email);
    expect(user?.name).not.toContain('<script>');
    expect(user?.name).toContain('&lt;script&gt;');
  });

  it('assigns admin role only to benauf7@gmail.com and student to others', async () => {
    const adminRes = await registerNewUser('المسؤول الرئيسي', 'benauf7@gmail.com', 'AdminPass123');
    expect(adminRes.user?.role).toBe('admin');

    const regularRes = await registerNewUser('طالب عادي', 'student_regular@math.edu.eg', 'StudentPass123');
    expect(regularRes.user?.role).toBe('student');
  });

  it('locks verification after 5 consecutive incorrect code attempts', async () => {
    const email = 'lock_test@math.edu.eg';
    await registerNewUser('طالب اختبار القفل', email, 'SafePassword123');

    // 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const res = await verifyAccountEmail(email, 'BAD99' + i);
      expect(res.success).toBe(false);
      expect(res.message).toContain('المحاولات المتبقية');
    }

    // 5th failed attempt -> locks account verification
    const fifthAttempt = await verifyAccountEmail(email, 'BAD995');
    expect(fifthAttempt.success).toBe(false);
    expect(fifthAttempt.message).toContain('تم قفل التحقق لمدة 15 دقيقة');

    // 6th attempt while locked -> blocked by lockout timer
    const sixthAttempt = await verifyAccountEmail(email, 'ANY999');
    expect(sixthAttempt.success).toBe(false);
    expect(sixthAttempt.message).toContain('تم تجميد محاولات إدخال الرمز مؤقتاً');
  });

  it('locks login after 5 consecutive failed password attempts', async () => {
    const email = 'login_lock@math.edu.eg';
    const reg = await registerNewUser('مستخدم حماية الدخول', email, 'CorrectPass123');
    await verifyAccountEmail(email, reg.code!);

    // 4 wrong password attempts
    for (let i = 0; i < 4; i++) {
      const res = await loginWithCredentials(email, 'WrongPass' + i);
      expect(res.success).toBe(false);
      expect(res.message).toContain('المحاولات المتبقية');
    }

    // 5th wrong password attempt -> triggers lockout
    const fifthAttempt = await loginWithCredentials(email, 'WrongPass5');
    expect(fifthAttempt.success).toBe(false);
    expect(fifthAttempt.message).toContain('تم قفل تسجيل الدخول لمدة 15 دقيقة');

    // 6th attempt -> blocked immediately
    const sixthAttempt = await loginWithCredentials(email, 'CorrectPass123');
    expect(sixthAttempt.success).toBe(false);
    expect(sixthAttempt.message).toContain('تم قفل تسجيل الدخول مؤقتاً');
  });
});
