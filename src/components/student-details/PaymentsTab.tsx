import React from 'react';
import { Wallet } from 'lucide-react';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { calculatePaymentStats } from '../../utils/payments';
import { formatNZDate } from '../../utils/dateTime';

interface PaymentsTabProps {
  studentId: string;
  bankTransactions: BankTransaction[];
  bankMappings: BankMapping[];
}

export function PaymentsTab({ studentId, bankTransactions, bankMappings }: PaymentsTabProps) {
  const studentMapping = bankMappings.find(m => m.studentId === studentId);
  const studentTransactions = studentMapping ? 
    bankTransactions
      .filter(t => t.otherPartyAccount === studentMapping.otherPartyAccount)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  const paymentStats = calculatePaymentStats(studentTransactions);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Payment Summary</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">3 Month Count</p>
            <p className="text-2xl font-semibold text-gray-900">{paymentStats.threeMonthCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">3 Month Total</p>
            <p className="text-2xl font-semibold text-gray-900">${paymentStats.threeMonthSum.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">6 Month Count</p>
            <p className="text-2xl font-semibold text-gray-900">{paymentStats.sixMonthCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">6 Month Total</p>
            <p className="text-2xl font-semibold text-gray-900">${paymentStats.sixMonthSum.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Reference</th>
              <th className="py-3 px-4 text-left">Account</th>
            </tr>
          </thead>
          <tbody>
            {studentTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-3 px-4">{formatNZDate(new Date(transaction.date))}</td>
                <td className="py-3 px-4">${transaction.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{transaction.code || '-'}</td>
                <td className="py-3 px-4">{transaction.reference || '-'}</td>
                <td className="py-3 px-4">{transaction.otherPartyAccount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}