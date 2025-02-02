import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

export function getFirebaseApp() {
  try {
    return getApp();
  } catch {
    const firebaseConfig = {
      apiKey: "AIzaSyCqm2r13IkEmRw8H5oM3t-4Se22capDqj8",
      authDomain: "kohikarate-7031c.firebaseapp.com",
      projectId: "kohikarate-7031c",
      storageBucket: "kohikarate-7031c.firebasestorage.app",
      messagingSenderId: "471367523561",
      appId: "1:471367523561:web:0549f059b9c531c0f6e478"
    };
    return initializeApp(firebaseConfig);
  }
}

const app = getFirebaseApp();
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}