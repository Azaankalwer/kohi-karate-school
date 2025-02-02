import React, { useState } from 'react';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import { JKALogo } from './JKALogo';
import { useTenantInit } from '../hooks/useTenantInit';

export function TenantSelection() {
  const { availableTenants, setCurrentTenant } = useTenant();
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const { isInitializing, error, retryInitialization } = useTenantInit(selectedTenantId);

  const handleTenantSelect = async (tenant: any) => {
    setSelectedTenantId(tenant.id);
    setCurrentTenant(tenant);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <JKALogo className="h-12" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Welcome to KohiKarate JKA
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Please select your dojo location to continue
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
            <button
              onClick={retryInitialization}
              className="ml-2 text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="space-y-3">
          {availableTenants.map(tenant => (
            <button
              key={tenant.id}
              onClick={() => handleTenantSelect(tenant)}
              disabled={isInitializing}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                '--hover-color': tenant.primaryColor
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400 group-hover:text-[var(--hover-color)]" />
                <span className="font-medium text-gray-900">
                  {tenant.name}
                  {selectedTenantId === tenant.id && isInitializing && (
                    <span className="ml-2 text-sm text-gray-500">
                      Initializing...
                    </span>
                  )}
                </span>
              </div>
              {selectedTenantId === tenant.id && isInitializing ? (
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--hover-color)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}