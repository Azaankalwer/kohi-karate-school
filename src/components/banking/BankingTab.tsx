import React, { useState } from 'react';
import { BankMappingsTab } from './BankMappingsTab';
import { TransactionsView } from './TransactionsView';
import { PaymentAuditTab } from './PaymentAuditTab';
import { PaymentSummariesTab } from './payment-summaries/PaymentSummariesTab';
import { BankingHeader } from './BankingHeader';
import { TabType } from './types';
import { useBankData } from './hooks/useBankData';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {BillingInvoicesTab} from './billing-invoices/BillingInvoicesTab';

export function BankingTab() {
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const { transactions, mappings, students, isLoading, error, reloadData } = useBankData();

  if (error) {
    return <ErrorMessage message={error} onRetry={reloadData} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <BankingHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'transactions' && (
        <TransactionsView
          transactions={transactions}
          mappings={mappings}
          students={students}
          onDataChange={reloadData}
        />
      )}

      {activeTab === 'mappings' && (
        <BankMappingsTab
          mappings={mappings}
          students={students}
          onMappingDeleted={reloadData}
        />
      )}

      {activeTab === 'audit' && (
        <PaymentAuditTab
          transactions={transactions}
          mappings={mappings}
          students={students}
        />
      )}

      {activeTab === 'summaries' && (
        <PaymentSummariesTab
          students={students}
          transactions={transactions}
          mappings={mappings}
        />
      )}

      {activeTab === 'billing' && (
        <BillingInvoicesTab
        />
      )}
    </div>
  );
}