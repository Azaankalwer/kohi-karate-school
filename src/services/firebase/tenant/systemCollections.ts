import { collection, getDocs, addDoc, query, where, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { DEFAULT_BELTS } from '../../constants/belts';

export async function initializeSystemCollections(tenantId: string) {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  try {
    // Run initializations sequentially to avoid race conditions
    await initializeBelts(tenantId);
    await initializeLogins(tenantId);
    await initializeSystemSetup(tenantId);
  } catch (error) {
    console.error('Error initializing system collections:', error);
    throw error;
  }
}

async function initializeBelts(tenantId: string) {
  const collectionRef = collection(db, 'lookup_belts');
  const q = query(collectionRef, where('tenantId', '==', tenantId));
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    console.log('Belts already exist for tenant:', tenantId);
    return;
  }

  const batch = writeBatch(db);
  
  DEFAULT_BELTS.forEach((belt, index) => {
    const docRef = doc(collectionRef);
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
  const collectionRef = collection(db, 'logins');
  const q = query(collectionRef, where('tenantId', '==', tenantId));
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    console.log('Logins already exist for tenant:', tenantId);
    return;
  }

  await addDoc(collectionRef, {
    email: `admin@kohikarate-${tenantId}.com`,
    password: 'admin',
    tenantId,
    role: 'admin'
  });
  
  console.log('Admin login initialized for tenant:', tenantId);
}

async function initializeSystemSetup(tenantId: string) {
  const setupRef = doc(db, 'system_setup', `tenant_${tenantId}`);
  await setupRef.set({
    tenantId,
    initialized: true,
    initDate: new Date().toISOString()
  }, { merge: true });
  
  console.log('System setup initialized for tenant:', tenantId);
}