import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Login, CreateLoginInput } from '../../types/login';
import { handleFirebaseError } from './error-handling';

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export async function addLogin(login: CreateLoginInput, tenantId: string): Promise<Login> {
  try {
    if (!login.email || !login.password) {
      throw new LoginError('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(login.email)) {
      throw new LoginError('Invalid email format');
    }

    // Validate password length
    if (login.password.length < 6) {
      throw new LoginError('Password must be at least 6 characters long');
    }

    // Check if email already exists for this tenant
    const emailQuery = query(
      collection(db, 'logins'),
      where('email', '==', login.email),
      where('tenantId', '==', tenantId)
    );
    
    const existingLogin = await getDocs(emailQuery);
    if (!existingLogin.empty) {
      throw new LoginError('This email is already registered');
    }

    const loginData = {
      ...login,
      tenantId
    };

    const docRef = await addDoc(collection(db, 'logins'), loginData);
    return {
      id: docRef.id,
      ...loginData
    };
  } catch (error) {
    if (error instanceof LoginError) {
      throw error;
    }
    const message = handleFirebaseError(error);
    throw new LoginError(`Failed to create login: ${message}`);
  }
}