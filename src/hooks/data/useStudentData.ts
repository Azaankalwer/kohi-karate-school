import { useState, useEffect, useCallback } from 'react';
import { Student } from '../../types/student';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../../services/firebase/students';
import { deleteAttendance } from '../../services/firebase/attendance';
import { getNZDateTimeString } from '../../utils/dateTime';

export function useStudentData(tenantId: string | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    if (!tenantId) {
      setStudents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedStudents = await fetchStudents(tenantId);
      setStudents(loadedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      loadStudents();
    }
  }, [tenantId, loadStudents]);

  return {
    students,
    isLoading,
    error,
    handlers: {
      handleRegister: async (studentData: Partial<Student>) => {
        if (!tenantId) {
          throw new Error('No tenant selected');
        }

        try {
          const { date: joinDate } = getNZDateTimeString();
          const newStudent = await addStudent({
            ...studentData,
            joinDate,
            status: 'Active'
          } as Omit<Student, 'id'>, tenantId);

          setStudents(prev => [...prev, newStudent]);
          return newStudent;
        } catch (error) {
          console.error('Error registering student:', error);
          throw error;
        }
      },
      handleUpdateStudent: async (updatedStudent: Student) => {
        if (!tenantId) {
          throw new Error('No tenant selected');
        }

        try {
          await updateStudent(updatedStudent, tenantId);
          setStudents(prev => prev.map(s => 
            s.id === updatedStudent.id ? updatedStudent : s
          ));
        } catch (error) {
          console.error('Error updating student:', error);
          throw error;
        }
      },
      handleDeleteStudent: async (studentId: string) => {
        if (!tenantId) {
          throw new Error('No tenant selected');
        }

        try {
          await deleteStudent(studentId);
          await deleteAttendance(studentId);
          setStudents(prev => prev.filter(s => s.id !== studentId));
        } catch (error) {
          console.error('Error deleting student:', error);
          throw error;
        }
      }
    },
    refresh: loadStudents
  };
}