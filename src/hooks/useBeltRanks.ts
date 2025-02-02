import { useState, useEffect } from 'react';
import { Belt } from '../types/belt';
import { fetchBelts } from '../services/firebase/belts';
import { useTenant } from '../contexts/TenantContext';

export function useBeltRanks() {
  const { currentTenant } = useTenant();
  const [belts, setBelts] = useState<Belt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBelts = async () => {
      if (!currentTenant) return;
      
      try {
        setIsLoading(true);
        const loadedBelts = await fetchBelts(currentTenant.id);
        setBelts(loadedBelts);
      } catch (error) {
        setError('Failed to load belt ranks');
        console.error('Error loading belt ranks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBelts();
  }, [currentTenant]);

  return {
    belts,
    isLoading,
    error
  };
}