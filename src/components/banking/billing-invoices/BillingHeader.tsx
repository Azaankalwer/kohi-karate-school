import { TabType } from './types';

interface BillingHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BillingHeader({ activeTab, onTabChange }: BillingHeaderProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-4">
        <button
          onClick={() => onTabChange('studentBilling')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'studentBilling'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Student Billing Setup
        </button>
        <button
          onClick={() => onTabChange('billingSetup')} 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'billingSetup'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
            Billing Setup Data
        </button>
        <button
          onClick={() => onTabChange('createInvoice')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'createInvoice'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
              Create Invoice
        </button>
        <button
          onClick={() => onTabChange('viewInvoice')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'viewInvoice'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
            View Invoices
        </button>

        <button
          onClick={() => onTabChange('invoiceSetup')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'invoiceSetup'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Invoice Setup
        </button>

        <button
          onClick={() => onTabChange('emailSetup')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'emailSetup'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email Setup
        </button>

        <button
          onClick={() => onTabChange('emailTest')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'emailTest'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email Test
        </button>
      </nav>
    </div>
  );
}