export interface TenantSetup {
  tenantId: string;
  initialized: boolean;
  initDate: string;
}

export interface TenantInitResult {
  success: boolean;
  error?: string;
}

export interface CollectionMigrationResult {
  collectionName: string;
  documentsProcessed: number;
  success: boolean;
  error?: string;
}