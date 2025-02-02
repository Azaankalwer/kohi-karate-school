import { useState, useEffect, useCallback } from 'react';
import { fetchClasses, addClass } from '../../services/firebase/classes';
import { getNZDateTimeString } from '../../utils/dateTime';

export function useClassData(tenantId: string | null) {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClasss = useCallback(async () => {
    if (!tenantId) {
      setClasses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedClasss = await fetchClasses(tenantId);
      setClasses(loadedClasss);
    } catch (error) {
      console.error('Error loading classes:', error);
      setError('Failed to load classes');
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      loadClasss();
    }
  }, [tenantId, loadClasss]);

  return {
    classes,
    isLoading,
    error,
    handlers: {
      handleCreateClass: async (classData: Partial<any>) => {
        if (!tenantId) {
          throw new Error('No tenant selected');
        }

        try {
          const { date: joinDate } = getNZDateTimeString();
          const newClass = await addClass({
            ...classData,
            joinDate,
            status: 'Active'
          } as Omit<any, 'id'>, tenantId);

          setClasses(prev => [...prev, newClass]);
          return newClass;
        } catch (error) {
          console.error('Error registering class:', error);
          throw error;
        }
      },
    },
    refresh: loadClasss
  };
}