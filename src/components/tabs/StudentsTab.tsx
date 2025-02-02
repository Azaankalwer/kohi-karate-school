import React, { useEffect } from 'react';
import { StudentList } from '../StudentList';
import { Student } from '../../types/student';
import { Attendance } from '../../types/attendance';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { fetchStudents } from '../../services/firebase/students';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useStudentData } from './hooks/useStudentData';

interface StudentsTabProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  attendance: Attendance[];
  bankTransactions: BankTransaction[];
  bankMappings: BankMapping[];
  onDataChange: () => void;
}

export function StudentsTab({ 
  students: initialStudents, 
  onSelectStudent, 
  attendance,
  bankTransactions,
  bankMappings,
  onDataChange
}: StudentsTabProps) {
  const { students, loading, error, refreshStudents } = useStudentData(initialStudents);

  // Refresh students list when tab becomes active
  useEffect(() => {
    refreshStudents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshStudents} />;
  }

  return (
    <StudentList 
      students={students} 
      onSelectStudent={onSelectStudent} 
      attendance={attendance}
      bankTransactions={bankTransactions}
      bankMappings={bankMappings}
      onDataChange={onDataChange}
    />
  );
}