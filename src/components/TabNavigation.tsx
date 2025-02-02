import React from 'react';
import { Users, BarChart2, Settings, ClipboardList, Wallet, UserPlus } from 'lucide-react';
import { useAppMode } from '../contexts/AppModeContext';

interface TabNavigationProps {
  activeTab: 'attendance' | 'students' | 'registration' | 'settings' | 'analytics' | 'banking';
  onTabChange: (tab: 'attendance' | 'students' | 'registration' | 'settings' | 'analytics' | 'banking') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { mode } = useAppMode();

  if (mode === 'register') {
    return (
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => onTabChange('registration')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600"
          >
            <UserPlus className="w-4 h-4" />
            Registration
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-4" aria-label="Tabs">
        <button
          onClick={() => onTabChange('attendance')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'attendance'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Check-in & Attendance
        </button>
        <button
          onClick={() => onTabChange('registration')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'registration'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Registration
        </button>
        <button
          onClick={() => onTabChange('students')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'students'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Students
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'analytics'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Analytics
        </button>
        <button
          onClick={() => onTabChange('banking')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'banking'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Banking/Invoicing
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </nav>
    </div>
  );
}