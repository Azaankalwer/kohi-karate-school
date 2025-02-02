import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function initializeSettings(tenantId: string) {
  if (!tenantId) return;

  const settingsRef = doc(db, 'settings', `tenant_${tenantId}`);
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    await setDoc(settingsRef, {
      tenantId,
      lastGradingDate: '',
      initialized: true,
      initDate: new Date().toISOString()
    });
    console.log('Settings initialized for tenant:', tenantId);
  }
}