import React from 'react';
import { User, ClipboardList, Shield, Wallet } from 'lucide-react';

type TabType = 'general' | 'attendance' | 'belt-ranking' | 'payments';

interface StudentDetailsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function StudentDetailsTabs({ activeTab, onTabChange }: StudentDetailsTabsProps) {
  return (
    <div className="mb-6">
      <nav className="flex space-x-4">
        <button
          onClick={() => onTabChange('general')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => onTabChange('attendance')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Attendance
        </button>
        <button
          onClick={() => onTabChange('belt-ranking')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
            activeTab === 'belt-ranking'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          Belt Ranking
        </button>
        <button
          onClick={() => onTabChange('payments')}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Payments
        </button>
      </nav>
    </div>
  );
}