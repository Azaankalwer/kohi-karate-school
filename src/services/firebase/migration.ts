import { collection, getDocs, writeBatch, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { addTenantToSystemCollection } from './system';

const COLLECTIONS_TO_MIGRATE = [
  'students',
  'attendance',
  'classes',
  'bankTransactions',
  'bankMappings',
  'promotions'
] as const;

export async function migrateToMultiTenant(tenantId: string): Promise<void> {
  try {
    console.log('Starting migration for tenant:', tenantId);
    
    // Initialize settings document for tenant
    const settingsRef = doc(db, 'settings', `tenant_${tenantId}`);
    await setDoc(settingsRef, { 
      tenantId,
      lastGradingDate: ''
    }, { merge: true });
    
    // Initialize system collections
    await Promise.all([
      addTenantToSystemCollection('lookup_belts', tenantId),
      addTenantToSystemCollection('logins', tenantId),
      addTenantToSystemCollection('system_setup', tenantId)
    ]);

    // Migrate regular collections
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      console.log(`Migrating collection: ${collectionName}`);
      
      const querySnapshot = await getDocs(collection(db, collectionName));
      if (querySnapshot.empty) {
        console.log(`No documents found in ${collectionName}`);
        continue;
      }
      
      const batch = writeBatch(db);
      let batchCount = 0;
      let totalUpdated = 0;
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        
        if (!data.tenantId) {
          const docRef = doc(db, collectionName, docSnapshot.id);
          batch.set(docRef, { ...data, tenantId }, { merge: true });
          batchCount++;
          totalUpdated++;
          
          if (batchCount === 500) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} updates`);
            batchCount = 0;
          }
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} updates`);
      }
      
      console.log(`Migration completed for ${collectionName}. Updated ${totalUpdated} documents.`);
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}