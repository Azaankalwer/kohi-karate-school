import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import { fetchSettings, updateSettings } from '../services/firebase/settings';
import { useTenant } from './TenantContext';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { currentTenant } = useTenant();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentTenant) return;
      
      try {
        setIsLoading(true);
        const loadedSettings = await fetchSettings(currentTenant.id);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [currentTenant]);

  const handleUpdateSettings = async (newSettings: Partial<Settings>) => {
    if (!currentTenant) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      await updateSettings(updatedSettings, currentTenant.id);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings: handleUpdateSettings,
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}