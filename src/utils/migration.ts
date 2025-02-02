import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../types/student';
import { Attendance } from '../types/attendance';
import { KarateClass } from '../types/class';
import { Settings } from '../types/settings';

const STORAGE_KEYS = {
  STUDENTS: 'karate_school_students',
  ATTENDANCE: 'karate_school_attendance',
  CLASSES: 'karate_school_classes',
  SETTINGS: 'karate_school_settings'
};

async function migrateCollection<T extends { id?: string }>(
  storageKey: string,
  collectionName: string
): Promise<void> {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return;

  const data = JSON.parse(stored) as T[];
  const collectionRef = collection(db, collectionName);

  // Check if collection is empty
  const snapshot = await getDocs(collectionRef);
  if (!snapshot.empty) {
    console.log(`Collection ${collectionName} is not empty, skipping migration`);
    return;
  }

  // Migrate data
  for (const item of data) {
    const { id, ...rest } = item;
    await addDoc(collectionRef, rest);
  }

  console.log(`Migrated ${data.length} items to ${collectionName}`);
}

export async function migrateToFirebase(): Promise<void> {
  try {
    await migrateCollection<Student>(STORAGE_KEYS.STUDENTS, 'students');
    await migrateCollection<Attendance>(STORAGE_KEYS.ATTENDANCE, 'attendance');
    await migrateCollection<KarateClass>(STORAGE_KEYS.CLASSES, 'classes');
    
    // Migrate settings
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (storedSettings) {
      const settings = JSON.parse(storedSettings) as Settings;
      await addDoc(collection(db, 'settings'), settings);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}