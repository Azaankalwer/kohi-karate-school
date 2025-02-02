import React from 'react';
import { ToggleLeft, ToggleRight, LogOut } from 'lucide-react';
import { JKALogo } from './JKALogo';
import { Tenant } from '../types/tenant';
import { AppMode } from '../types/navigation';
import { useTenant } from '../contexts/TenantContext';

interface HeaderProps {
  tenant: Tenant;
  mode: AppMode;
  onModeToggle: () => void;
}

export function Header({ tenant, mode, onModeToggle }: HeaderProps) {
  const { clearTenant } = useTenant();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <JKALogo />
              <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            </div>
            <div className="ml-11 text-sm text-gray-500">
              Tenant ID: {tenant.id}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onModeToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              title={`Switch to ${mode === 'admin' ? 'register' : 'admin'} mode`}
            >
              {mode === 'admin' ? (
                <>
                  <ToggleRight className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium">Admin Mode</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Register Mode</span>
                </>
              )}
            </button>
            <button
              onClick={clearTenant}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              title="Switch Location"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Switch Location</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}