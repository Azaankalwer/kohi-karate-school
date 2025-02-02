import React, { useState } from 'react';
import { Settings, Shield } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { GeneralSettings } from './GeneralSettings';
import { BeltsSettings } from './BeltsSettings';

type SettingsTabType = 'general' | 'belts';

export function SettingsTab() {
  const { isLoading } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTabType>('general');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800">Loading Settings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'general'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </div>
          </button>
          <button
            onClick={() => setActiveTab('belts')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'belts'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Belts
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'belts' && <BeltsSettings />}
    </div>
  );
}