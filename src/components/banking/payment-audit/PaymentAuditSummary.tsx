import React from 'react';
import { DollarSign, CreditCard, Users } from 'lucide-react';
import { PaymentAuditSummaryData } from './types';

interface PaymentAuditSummaryProps {
  summary: PaymentAuditSummaryData;
}

export function PaymentAuditSummary({ summary }: PaymentAuditSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <h3 className="font-medium text-gray-900">Total Amount</h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          ${summary.totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h3 className="font-medium text-gray-900">Total Payments</h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          {summary.totalPayments}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Unique Students</h3>
        </div>
        <p className="text-2xl font-semibold text-gray-900">
          {summary.uniqueStudents}
        </p>
      </div>
    </div>
  );
}