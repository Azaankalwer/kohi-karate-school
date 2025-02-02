import { checkTenantSetup, createTenantSetup } from './setup';
import { initializeCollection } from './collections';
import { TenantInitResult } from './types';
import { validateTenantId } from './validation';

const SYSTEM_COLLECTIONS = [
  'lookup_belts',
  'logins',
  'system_setup'
] as const;

const DATA_COLLECTIONS = [
  'students',
  'attendance',
  'classes',
  'bankTransactions',
  'bankMappings',
  'promotions'
] as const;

export async function initializeTenant(tenantId: string): Promise<TenantInitResult> {
  try {
    validateTenantId(tenantId);

    // Check if already initialized
    const isInitialized = await checkTenantSetup(tenantId);
    if (isInitialized) {
      return { success: true };
    }

    // Initialize system collections first
    for (const collectionName of SYSTEM_COLLECTIONS) {
      const result = await initializeCollection(collectionName, tenantId);
      if (!result.success) {
        throw new Error(`Failed to initialize ${collectionName}: ${result.error}`);
      }
    }

    // Then initialize data collections
    for (const collectionName of DATA_COLLECTIONS) {
      const result = await initializeCollection(collectionName, tenantId);
      if (!result.success) {
        throw new Error(`Failed to initialize ${collectionName}: ${result.error}`);
      }
    }

    // Mark tenant as initialized
    await createTenantSetup(tenantId);

    return { success: true };
  } catch (error) {
    console.error('Error initializing tenant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during tenant initialization'
    };
  }
}