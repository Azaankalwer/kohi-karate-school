import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { PaymentAuditTable } from './payment-audit/PaymentAuditTable';
import { PaymentAuditSummary } from './payment-audit/PaymentAuditSummary';
import { PaymentAuditFilters } from './payment-audit/PaymentAuditFilters';
import { usePaymentAudit } from './payment-audit/hooks/usePaymentAudit';
import { Student } from '../../types/student';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';

interface PaymentAuditTabProps {
  students: Student[];
  transactions: BankTransaction[];
  mappings: BankMapping[];
}

export function PaymentAuditTab({ students, transactions, mappings }: PaymentAuditTabProps) {
  const {
    filteredTransactions,
    dateRange,
    studentFilter,
    setDateRange,
    setStudentFilter,
    summary
  } = usePaymentAudit(transactions, mappings, students);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Payment Audit</h2>
      </div>

      <PaymentAuditFilters
        dateRange={dateRange}
        studentFilter={studentFilter}
        onDateRangeChange={setDateRange}
        onStudentFilterChange={setStudentFilter}
        students={students}
      />

      <PaymentAuditSummary summary={summary} />

      <PaymentAuditTable
        transactions={filteredTransactions}
        students={students}
        mappings={mappings}
      />
    </div>
  );
}