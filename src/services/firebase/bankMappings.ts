import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BankMapping } from '../../types/bankMapping';
import { handleFirebaseError } from './error-handling';

const COLLECTION_NAME = 'bankMappings';

export class BankMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BankMappingError';
  }
}

export async function fetchBankMappings(tenantId: string): Promise<BankMapping[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('tenantId', '==', tenantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BankMapping));
  } catch (error) {
    const message = handleFirebaseError(error);
    throw new BankMappingError(`Failed to fetch bank mappings: ${message}`);
  }
}

export async function addBankMapping(mapping: Omit<BankMapping, 'id'>, tenantId: string): Promise<BankMapping> {
  try {
    if (!mapping.studentId || !mapping.otherPartyAccount) {
      throw new BankMappingError('Student ID and account number are required');
    }

    // Validate input format
    if (!/^[0-9-]+$/.test(mapping.otherPartyAccount)) {
      throw new BankMappingError('Invalid account number format');
    }

    // Check for existing mapping for this account within the tenant
    const accountQuery = query(
      collection(db, COLLECTION_NAME),
      where('otherPartyAccount', '==', mapping.otherPartyAccount),
      where('tenantId', '==', tenantId)
    );
    
    const existingAccountMapping = await getDocs(accountQuery);
    if (!existingAccountMapping.empty) {
      throw new BankMappingError('This account is already mapped to a student');
    }

    // Check for existing mapping for this student within the tenant
    const studentQuery = query(
      collection(db, COLLECTION_NAME),
      where('studentId', '==', mapping.studentId),
      where('tenantId', '==', tenantId)
    );

    const existingStudentMapping = await getDocs(studentQuery);
    if (!existingStudentMapping.empty) {
      throw new BankMappingError('This student is already mapped to an account');
    }

    const mappingData = {
      ...mapping,
      tenantId
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), mappingData);
    return {
      id: docRef.id,
      ...mappingData
    };
  } catch (error) {
    if (error instanceof BankMappingError) {
      throw error;
    }
    const message = handleFirebaseError(error);
    throw new BankMappingError(`Failed to add bank mapping: ${message}`);
  }
}

export async function deleteBankMapping(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    const message = handleFirebaseError(error);
    throw new BankMappingError(`Failed to delete bank mapping: ${message}`);
  }
}