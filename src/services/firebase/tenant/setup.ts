import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { TenantSetup } from './types';
import { validateTenantId } from './validation';

export async function checkTenantSetup(tenantId: string): Promise<boolean> {
  validateTenantId(tenantId);

  const setupRef = doc(db, 'system_setup', `tenant_${tenantId}`);
  const setupDoc = await getDoc(setupRef);
  
  return setupDoc.exists() && setupDoc.data()?.initialized === true;
}

export async function createTenantSetup(tenantId: string): Promise<void> {
  validateTenantId(tenantId);

  const setupRef = doc(db, 'system_setup', `tenant_${tenantId}`);
  const setup: TenantSetup = {
    tenantId,
    initialized: true,
    initDate: new Date().toISOString()
  };

  await setDoc(setupRef, setup);
}