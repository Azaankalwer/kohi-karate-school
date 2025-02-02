export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  beltRank: BeltRank;
  email: string;
  phone: string;
  joinDate: string;
  dateOfBirth: string;
  notes?: string;
  medicalNotes?: string;
  status: StudentStatus;
  emergencyContact: EmergencyContact;
  gender: Gender;
  type: StudentType;
}

export interface StudentOption {
  value: string;
  label: string;
  student: Student;
}

export type Gender = 'Male' | 'Female';
export type StudentType = 'Trial' | 'Student';

export interface EmergencyContact {
  name: string;
  phone: string;
}

export type StudentStatus = 'Active' | 'Old';

export type BeltRank =
  | "White"
  | "Yellow"
  | "Orange"
  | "Green"
  | "Blue"
  | "Purple"
  | "Brown 3"
  | "Brown 2"
  | "Brown 1"
  | "Black 1"
  | "Black 2"
  | "Black 3";

export const BELT_RANKS: BeltRank[] = [
  "White",
  "Yellow",
  "Orange",
  "Green",
  "Blue",
  "Purple",
  "Brown 3",
  "Brown 2",
  "Brown 1",
  "Black 1",
  "Black 2",
  "Black 3"
];

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    if (isNaN(birthDate.getTime())) {
      return 0;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
}

export function calculateDaysAgo(date: string | Date | null): number {
  if (!date) return 0;
  const today = new Date();
  const compareDate = new Date(date);
  const diffTime = Math.abs(today.getTime() - compareDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}