import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant } from '../types/tenant';

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  availableTenants: Tenant[];
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const AVAILABLE_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'Kohi Karate Auckland',
    primaryColor: '#4F46E5'
  },
  {
    id: '2',
    name: 'Kohi Karate Wellington',
    primaryColor: '#059669'
  }
];

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem('currentTenant');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('currentTenant');
      return null;
    }
  });

  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem('currentTenant', JSON.stringify(currentTenant));
    } else {
      localStorage.removeItem('currentTenant');
    }
  }, [currentTenant]);

  const clearTenant = () => {
    localStorage.removeItem('currentTenant');
    setCurrentTenant(null);
  };

  const value = {
    currentTenant,
    setCurrentTenant,
    availableTenants: AVAILABLE_TENANTS,
    clearTenant
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}