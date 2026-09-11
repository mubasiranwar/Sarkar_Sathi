import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../data/translations';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  savedPrograms: string[];
  toggleSaveProgram: (id: string) => void;
  documentChecklist: Record<string, 'ready' | 'not-ready' | 'not-sure'>;
  setDocumentStatus: (doc: string, status: 'ready' | 'not-ready' | 'not-sure') => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
}

interface UserProfile {
  need: string;
  province?: string;
  age?: number;
  isStudent?: boolean;
  isEmployed?: boolean;
  householdIncome?: 'low' | 'middle' | 'high';
  gender?: 'male' | 'female';
  hasChildren?: boolean;
  isFarmer?: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sarkar-sathi-lang');
    return (saved as Language) || 'en';
  });
  
  const [savedPrograms, setSavedPrograms] = useState<string[]>(() => {
    const saved = localStorage.getItem('sarkar-sathi-saved');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [documentChecklist, setDocumentChecklist] = useState<Record<string, 'ready' | 'not-ready' | 'not-sure'>>(() => {
    const saved = localStorage.getItem('sarkar-sathi-docs');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sarkar-sathi-profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sarkar-sathi-lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };
  
  const toggleSaveProgram = (id: string) => {
    setSavedPrograms(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem('sarkar-sathi-saved', JSON.stringify(next));
      return next;
    });
  };
  
  const setDocumentStatus = (doc: string, status: 'ready' | 'not-ready' | 'not-sure') => {
    setDocumentChecklist(prev => {
      const next = { ...prev, [doc]: status };
      localStorage.setItem('sarkar-sathi-docs', JSON.stringify(next));
      return next;
    });
  };
  
  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      localStorage.setItem('sarkar-sathi-profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('sarkar-sathi-profile');
    }
  };
  
  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);
  
  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      savedPrograms,
      toggleSaveProgram,
      documentChecklist,
      setDocumentStatus,
      userProfile,
      setUserProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
