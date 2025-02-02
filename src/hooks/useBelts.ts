import { useState, useEffect } from 'react';
import { Belt } from '../types/belt';
import { fetchBelts } from '../services/firebase/belts';

export function useBelts() {
  const [belts, setBelts] = useState<Belt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBelts();
  }, []);

  const loadBelts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedBelts = await fetchBelts();
      setBelts(loadedBelts);
    } catch (error) {
      setError('Failed to load belts');
      console.error('Error loading belts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    belts,
    isLoading,
    error,
    reloadBelts: loadBelts
  };
}