import { collection, getDocs, addDoc, query, where, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { DEFAULT_BELTS } from '../constants/belts';

const SYSTEM_COLLECTIONS = ['lookup_belts', 'logins', 'system_setup'] as const;

export async function initializeSystemCollections(tenantId: string) {
  try {
    console.log('Initializing system collections for tenant:', tenantId);
    
    await Promise.all([
      initializeBelts(tenantId),
      initializeLogins(tenantId),
      initializeSystemSetup(tenantId)
    ]);
    
    console.log('System collections initialized successfully');
  } catch (error) {
    console.error('Error initializing system collections:', error);
    throw error;
  }
}

export async function addTenantToSystemCollection(collectionName: string, tenantId: string) {
  try {
    const q = query(collection(db, collectionName), where('tenantId', '==', tenantId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log(`Collection ${collectionName} already has tenant ${tenantId}`);
      return;
    }

    const batch = writeBatch(db);
    
    if (collectionName === 'lookup_belts') {
      DEFAULT_BELTS.forEach((belt, index) => {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, {
          ...belt,
          tenantId,
          order: index
        });
      });
    }

    await batch.commit();
    console.log(`Added tenant ${tenantId} to ${collectionName}`);
  } catch (error) {
    console.error(`Error adding tenant to ${collectionName}:`, error);
    throw error;
  }
}

async function initializeBelts(tenantId: string) {
  const q = query(
    collection(db, 'lookup_belts'),
    where('tenantId', '==', tenantId)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    console.log('Belts already initialized for tenant:', tenantId);
    return;
  }

  const batch = writeBatch(db);
  
  DEFAULT_BELTS.forEach((belt, index) => {
    const docRef = doc(collection(db, 'lookup_belts'));
    batch.set(docRef, {
      ...belt,
      tenantId,
      order: index
    });
  });

  await batch.commit();
  console.log('Belts initialized for tenant:', tenantId);
}

async function initializeLogins(tenantId: string) {
  const q = query(
    collection(db, 'logins'),
    where('tenantId', '==', tenantId)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    console.log('Logins already initialized for tenant:', tenantId);
    return;
  }

  await addDoc(collection(db, 'logins'), {
    email: `admin@kohikarate-${tenantId}.com`,
    password: 'admin',
    tenantId,
    role: 'admin'
  });
  
  console.log('Admin login initialized for tenant:', tenantId);
}

async function initializeSystemSetup(tenantId: string) {
  const setupDoc = doc(db, 'system_setup', `tenant_${tenantId}`);
  await setDoc(setupDoc, {
    tenantId,
    initialized: true,
    initDate: new Date().toISOString()
  }, { merge: true });
  
  console.log('System setup initialized for tenant:', tenantId);
}

export async function cleanupTenantData(tenantId: string) {
  try {
    console.log('Starting tenant data cleanup for:', tenantId);
    
    const batch = writeBatch(db);
    
    for (const collectionName of SYSTEM_COLLECTIONS) {
      const q = query(
        collection(db, collectionName),
        where('tenantId', '==', tenantId)
      );
      
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }
    
    await batch.commit();
    console.log('Tenant data cleanup completed');
  } catch (error) {
    console.error('Error cleaning up tenant data:', error);
    throw error;
  }
}