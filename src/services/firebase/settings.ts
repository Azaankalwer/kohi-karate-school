import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Settings, DEFAULT_SETTINGS } from '../../types/settings';

export async function fetchSettings(tenantId: string): Promise<Settings> {
  const docRef = doc(db, 'settings', `tenant_${tenantId}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as Settings;
  }
  
  // If no settings exist, create default settings for this tenant
  const defaultSettings = {
    ...DEFAULT_SETTINGS,
    tenantId
  };
  
  await setDoc(docRef, defaultSettings);
  return defaultSettings;
}

export async function updateSettings(settings: Settings, tenantId: string): Promise<void> {
  const docRef = doc(db, 'settings', `tenant_${tenantId}`);
  await setDoc(docRef, { ...settings, tenantId }, { merge: true });
}