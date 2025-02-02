import React from 'react';
import { StudentList } from './StudentList';
import { Student } from '../types/student';
import { useMultiTenant } from '../hooks/useMultiTenant';
// ... other imports

export function StudentsTab({ 
  students: initialStudents, 
  onSelectStudent,
  // ... other props
}: StudentsTabProps) {
  const { tenantId, filterByTenant } = useMultiTenant();
  const filteredStudents = filterByTenant(initialStudents);

  // ... rest of the component code using filteredStudents instead of students
}