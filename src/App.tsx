import React, { useEffect } from 'react';
import { useTenant } from './contexts/TenantContext';
import { TenantSelection } from './components/TenantSelection';
import { MainLayout } from './layouts/MainLayout';

function App() {
  const { currentTenant, clearTenant } = useTenant();

  // Clear tenant on initial load to force selection
  useEffect(() => {
    clearTenant();
  }, []);

  if (!currentTenant) {
    return <TenantSelection />;
  }

  return <MainLayout />;
}

export default App;