import { useState, useEffect, useCallback } from 'react';
import { initializeTenant } from '../services/firebase/tenant/initializeTenant';

export function useTenantInit(tenantId: string | null) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (!tenantId) {
      return;
    }

    try {
      setIsInitializing(true);
      setError(null);
      await initializeTenant(tenantId);
    } catch (error) {
      console.error('Error initializing tenant:', error);
      setError('Failed to initialize tenant');
    } finally {
      setIsInitializing(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      initialize();
    }
  }, [tenantId, initialize]);

  return { 
    isInitializing, 
    error,
    retryInitialization: initialize 
  };
}