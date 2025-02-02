import React from 'react';
import { Link, Wallet, FileSpreadsheet, FileText } from 'lucide-react';
import { TabType } from './types';

interface BankingHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BankingHeader({ activeTab, onTabChange }: BankingHeaderProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-4">
        <button
          onClick={() => onTabChange('transactions')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'transactions'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Transactions
        </button>
        <button
          onClick={() => onTabChange('mappings')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'mappings'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Link className="w-4 h-4" />
          Bank Mappings
        </button>
        <button
          onClick={() => onTabChange('audit')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'audit'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Payment Audit
        </button>
        <button
          onClick={() => onTabChange('summaries')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'summaries'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Payment Summaries
        </button>

        <button
          onClick={() => onTabChange('billing')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'billing'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Billing/Invoices
        </button>
      </nav>
    </div>
  );
}