import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppMode = 'admin' | 'register';

interface AppModeContextType {
  mode: AppMode;
  toggleMode: () => void;
  lastRegisteredStudent: string | null;
  setLastRegisteredStudent: (studentId: string | null) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('register');
  const [lastRegisteredStudent, setLastRegisteredStudent] = useState<string | null>(null);

  const toggleMode = () => {
    setMode(prev => prev === 'admin' ? 'register' : 'admin');
    setLastRegisteredStudent(null);
  };

  const value = {
    mode,
    toggleMode,
    lastRegisteredStudent,
    setLastRegisteredStudent
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
}