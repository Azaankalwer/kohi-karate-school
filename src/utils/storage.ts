import { Student } from '../types/student';
import { Attendance } from '../types/attendance';
import { KarateClass } from '../types/class';
import { mockStudents } from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'karate_school_students',
  ATTENDANCE: 'karate_school_attendance',
  CLASSES: 'karate_school_classes'
} as const;

export function loadStudents(): Student[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
      return mockStudents;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading students:', error);
    return mockStudents;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students:', error);
  }
}

export function loadAttendance(): Attendance[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading attendance:', error);
    return [];
  }
}

export function saveAttendance(attendance: Attendance[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  } catch (error) {
    console.error('Error saving attendance:', error);
  }
}

export function loadClasses(): KarateClass[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify([]));
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading classes:', error);
    return [];
  }
}

export function saveClasses(classes: KarateClass[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  } catch (error) {
    console.error('Error saving classes:', error);
  }
}