import { Student } from '../types/student';

export function generateStudentCSV(students: Student[]): string {
  // Define CSV headers
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Gender',
    'Belt Rank',
    'Type',
    'Status',
    'Join Date',
    'Medical Notes',
    'Emergency Contact Name',
    'Emergency Contact Phone'
  ];

  // Convert students to CSV rows
  const rows = students.map(student => [
    student.id,
    student.firstName,
    student.lastName,
    student.email,
    student.phone,
    student.dateOfBirth,
    student.gender,
    student.beltRank,
    student.type || 'Student',
    student.status,
    student.joinDate,
    student.medicalNotes || '',
    student.emergencyContact.name,
    student.emergencyContact.phone
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}