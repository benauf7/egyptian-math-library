import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  SentEmail,
  getActiveSessionUser, 
  setActiveSessionUser, 
  registerNewUser, 
  loginWithCredentials, 
  verifyAccountEmail, 
  requestPasswordReset, 
  completePasswordReset, 
  resendVerificationCode,
  getRecentEmails,
  getUserByEmail
} from '../utils/auth-db';

export type AuthModalTab = 'login' | 'register' | 'verify' | 'forgot' | 'reset';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  authModalReason: string;
  pendingEmail: string;
  sentEmails: SentEmail[];
  unreadEmailsCount: number;
  openAuthModal: (tab?: AuthModalTab, reason?: string, email?: string) => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string; requiresVerification?: boolean }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message: string; code?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; code?: string }>;
  resetPassword: (email: string, code: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; message: string; code?: string }>;
  logout: () => void;
  refreshEmails: () => Promise<void>;
  requireAuth: <T>(action: () => T, actionDesc?: string) => T | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);

  const refreshEmails = async () => {
    const list = await getRecentEmails();
    setSentEmails(list);
  };

  // Initialize session
  useEffect(() => {
    const current = getActiveSessionUser();
    setUser(current);
    setIsLoading(false);
    refreshEmails();

    // Listen to custom window events
    const handleAuthChange = (e: CustomEvent<User | null>) => {
      setUser(e.detail);
    };

    const handleEmailReceived = (e: CustomEvent<SentEmail>) => {
      setSentEmails(prev => [e.detail, ...prev.filter(item => item.id !== e.detail.id)]);
    };

    const handleAuthRequired = (e: CustomEvent<{ reason: string }>) => {
      openAuthModal('login', e.detail.reason || 'يجب تسجيل الدخول للمتابعة');
    };

    window.addEventListener('egyptian_math_auth_changed', handleAuthChange as EventListener);
    window.addEventListener('egyptian_math_email_received', handleEmailReceived as EventListener);
    window.addEventListener('egyptian_math_auth_required', handleAuthRequired as EventListener);

    return () => {
      window.removeEventListener('egyptian_math_auth_changed', handleAuthChange as EventListener);
      window.removeEventListener('egyptian_math_email_received', handleEmailReceived as EventListener);
      window.removeEventListener('egyptian_math_auth_required', handleAuthRequired as EventListener);
    };
  }, []);

  const openAuthModal = (tab: AuthModalTab = 'login', reason: string = '', email: string = '') => {
    setAuthModalTab(tab);
    setAuthModalReason(reason);
    if (email) setPendingEmail(email);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  };

  const login = async (email: string, pass: string) => {
    const res = await loginWithCredentials(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      closeAuthModal();
    } else if (res.requiresVerification) {
      setPendingEmail(email);
      setAuthModalTab('verify');
      await refreshEmails();
    }
    return res;
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await registerNewUser(name, email, pass);
    if (res.success) {
      setPendingEmail(email);
      setAuthModalTab('verify');
      await refreshEmails();
    }
    return res;
  };

  const verifyEmail = async (email: string, code: string) => {
    const res = await verifyAccountEmail(email, code);
    if (res.success && res.user) {
      setUser(res.user);
      closeAuthModal();
      await refreshEmails();
    }
    return res;
  };

  const forgotPassword = async (email: string) => {
    const res = await requestPasswordReset(email);
    if (res.success) {
      setPendingEmail(email);
      setAuthModalTab('reset');
      await refreshEmails();
    }
    return res;
  };

  const resetPassword = async (email: string, code: string, newPass: string) => {
    const res = await completePasswordReset(email, code, newPass);
    if (res.success && res.user) {
      setUser(res.user);
      closeAuthModal();
      await refreshEmails();
    }
    return res;
  };

  const resendCode = async (email: string) => {
    const res = await resendVerificationCode(email);
    await refreshEmails();
    return res;
  };

  const logout = () => {
    setActiveSessionUser(null);
    setUser(null);
  };

  const requireAuth = <T,>(action: () => T, actionDesc: string = 'إتمام هذه العملية'): T | void => {
    if (!user) {
      openAuthModal('login', `يجب تسجيل الدخول أو إنشاء حساب أولاً لـ ${actionDesc}!`);
      return;
    }
    return action();
  };

  const unreadEmailsCount = sentEmails.filter(e => !e.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        authModalReason,
        pendingEmail,
        sentEmails,
        unreadEmailsCount,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        resendCode,
        logout,
        refreshEmails,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
