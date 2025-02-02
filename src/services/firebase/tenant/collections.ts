import { collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { CollectionMigrationResult } from './types';
import { validateTenantId, validateCollectionName } from './validation';
import { DEFAULT_BELTS } from '../../constants/belts';

export async function initializeCollection(
  collectionName: string,
  tenantId: string
): Promise<CollectionMigrationResult> {
  validateTenantId(tenantId);
  validateCollectionName(collectionName);

  try {
    // Check if collection already has documents for this tenant
    const q = query(
      collection(db, collectionName),
      where('tenantId', '==', tenantId)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return {
        collectionName,
        documentsProcessed: 0,
        success: true
      };
    }

    // Initialize collection based on type
    if (collectionName === 'lookup_belts') {
      await initializeBelts(tenantId);
    } else if (collectionName === 'logins') {
      await initializeLogins(tenantId);
    }

    return {
      collectionName,
      documentsProcessed: 1,
      success: true
    };
  } catch (error) {
    console.error(`Error initializing ${collectionName}:`, error);
    return {
      collectionName,
      documentsProcessed: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function initializeBelts(tenantId: string): Promise<void> {
  const batch = writeBatch(db);
  const collectionRef = collection(db, 'lookup_belts');

  DEFAULT_BELTS.forEach((belt, index) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, {
      ...belt,
      tenantId,
      order: index
    });
  });

  await batch.commit();
}

async function initializeLogins(tenantId: string): Promise<void> {
  const collectionRef = collection(db, 'logins');
  await doc(collectionRef).set({
    email: `admin@kohikarate-${tenantId}.com`,
    password: 'admin',
    tenantId,
    role: 'admin'
  });
}