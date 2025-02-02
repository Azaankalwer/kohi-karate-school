import { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Student, StudentOption } from '../../../types/student';

export function useStudentSearch(searchTerm: string) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);

  useEffect(() => {
    const searchStudents = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setStudents([]);
        return;
      }

      setLoading(true);
      try {
        const searchTermLower = searchTerm.toLowerCase();
        const q = query(collection(db, 'students'));
        const snapshot = await getDocs(q);
        
        const matchingStudents = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Student))
          .filter(student => 
            student.firstName.toLowerCase().includes(searchTermLower) ||
            student.lastName.toLowerCase().includes(searchTermLower)
          )
          .map(student => ({
            value: student.id,
            label: `${student.firstName} ${student.lastName}`,
            student
          }));

        setStudents(matchingStudents);
      } catch (error) {
        console.error('Error searching students:', error);
      } finally {
        setLoading(false);
      }
    };

    searchStudents();
  }, [searchTerm]);

  return { loading, students };
}