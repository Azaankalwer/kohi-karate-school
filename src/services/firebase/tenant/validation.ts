export function validateTenantId(tenantId: string | null | undefined): asserts tenantId is string {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }
  
  if (typeof tenantId !== 'string') {
    throw new Error('Invalid tenant ID format');
  }
}

export function validateCollectionName(collectionName: string): void {
  const validCollections = [
    'students',
    'attendance',
    'classes',
    'bankTransactions',
    'bankMappings',
    'promotions',
    'lookup_belts',
    'logins',
    'system_setup'
  ];

  if (!validCollections.includes(collectionName)) {
    throw new Error(`Invalid collection name: ${collectionName}`);
  }
}