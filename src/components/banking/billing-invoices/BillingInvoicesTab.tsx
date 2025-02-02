import React, { useState } from 'react';
import { BillingHeader } from './BillingHeader';
import { TabType } from './types';
import { StudentBillingForm } from './student-billing/StudentBillingForm';

export  function BillingInvoicesTab() {
  const [activeTab, setActiveTab] = useState<TabType>('studentBilling');
//   const { transactions, mappings, students, isLoading, error, reloadData } = useBankData();

//   if (error) {
//     return <ErrorMessage message={error} onRetry={reloadData} />;
//   }

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

  return (
    <div className="space-y-6">
      <BillingHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'studentBilling' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Student Billing Setup</h2>
                  {/* <StudentBillingForm initialStudentId={selectedStudentId} /> */}
                </div>
              )}

      {/* {activeTab === 'transactions' && (
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
          // students={students}
          // transactions={transactions}
          // mappings={mappings}
        />
      )} */}
    </div>
  );
}