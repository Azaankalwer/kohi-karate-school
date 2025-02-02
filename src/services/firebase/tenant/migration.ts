import { collection, getDocs, writeBatch, doc, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const COLLECTIONS_TO_MIGRATE = [
  'students',
  'attendance',
  'classes',
  'bankTransactions',
  'bankMappings',
  'promotions'
] as const;

export async function migrateCollections(tenantId: string) {
  if (!tenantId) return;

  try {
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      await migrateCollection(collectionName, tenantId);
    }
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

async function migrateCollection(collectionName: string, tenantId: string) {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where('tenantId', '==', null));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log(`No documents to migrate in ${collectionName}`);
    return;
  }

  const batch = writeBatch(db);
  let count = 0;

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { tenantId });
    count++;
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Migrated ${count} documents in ${collectionName}`);
  }
}