import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { addLogin } from './logins';

export async function initializeAdminLogin() {
  try {
    // Check if admin login already exists
    const q = query(
      collection(db, 'logins'),
      where('email', '==', 'admin@kohikarate.com')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add admin login if it doesn't exist
      await addLogin({
        email: 'admin@kohikarate.com',
        password: 'admin'
      });
      console.log('Admin login initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing admin login:', error);
  }
}