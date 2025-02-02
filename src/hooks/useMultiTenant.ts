import { useTenant } from '../contexts/TenantContext';

export function useMultiTenant() {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    throw new Error('useMultiTenant must be used within a tenant context');
  }

  const addTenantId = <T extends object>(data: T): T & { tenantId: string } => ({
    ...data,
    tenantId: currentTenant.id
  });

  const filterByTenant = <T extends { tenantId?: string }>(items: T[]): T[] => {
    return items.filter(item => item.tenantId === currentTenant.id);
  };

  return {
    tenantId: currentTenant.id,
    addTenantId,
    filterByTenant
  };
}