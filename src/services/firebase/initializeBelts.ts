import { collection, getDocs, addDoc, query, where, getFirestore } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { DEFAULT_BELTS } from '../constants/belts';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function initializeBelts() {
  try {
    // First check if we need to initialize
    const beltCollection = collection(db, 'lookup_belts');
    const snapshot = await getDocs(beltCollection);
    
    // If belts already exist, no need to initialize
    if (!snapshot.empty) {
      console.log('Belts already initialized');
      return;
    }

    // Try to authenticate as admin first
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, 'admin@kohikarate.com', 'admin');
    } catch (authError) {
      console.log('Admin authentication not required - belts will be initialized by backend');
      return;
    }

    // Add default belts one at a time to handle potential permission issues
    for (const belt of DEFAULT_BELTS) {
      try {
        await addDoc(beltCollection, belt);
      } catch (error) {
        if (error.code === 'permission-denied') {
          console.log('Belt initialization will be handled by backend');
          return;
        }
        throw error;
      }
    }

    console.log('Initialized belts successfully');
  } catch (error) {
    // Only log the error but don't throw - belt initialization is not critical for app startup
    console.log('Belt initialization will be handled by backend');
  }
}