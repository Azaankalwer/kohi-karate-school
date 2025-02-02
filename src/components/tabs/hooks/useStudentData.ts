import { useState, useEffect, useCallback } from 'react';
import { Student } from '../../../types/student';
import { fetchStudents } from '../../../services/firebase/students';
import { useTenant } from '../../../contexts/TenantContext';

export function useStudentData(initialStudents: Student[]) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;


  const refreshStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedStudents = await fetchStudents(tenantId);
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    students,
    loading,
    error,
    refreshStudents
  };
}