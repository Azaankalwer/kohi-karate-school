export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
}

export const DEFAULT_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'Kohi Karate Auckland',
    primaryColor: '#4F46E5'
  },
  {
    id: '2',
    name: 'Kohi Karate Wellington',
    primaryColor: '#059669'
  }
];