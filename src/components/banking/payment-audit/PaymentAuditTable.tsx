import React from 'react';
import { BankTransaction } from '../../../types/bankTransaction';
import { Student } from '../../../types/student';
import { BankMapping } from '../../../types/bankMapping';
import { formatNZDate } from '../../../utils/dateTime';

interface PaymentAuditTableProps {
  transactions: BankTransaction[];
  students: Student[];
  mappings: BankMapping[];
}

export function PaymentAuditTable({ transactions, students, mappings }: PaymentAuditTableProps) {
  const getStudentName = (transaction: BankTransaction) => {
    const mapping = mappings.find(m => m.otherPartyAccount === transaction.otherPartyAccount);
    if (!mapping) return 'Unmapped';
    
    const student = students.find(s => s.id === mapping.studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Student</th>
            <th className="py-3 px-4 text-left">Amount</th>
            <th className="py-3 px-4 text-left">Account</th>
            <th className="py-3 px-4 text-left">Reference</th>
            <th className="py-3 px-4 text-left">Code</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-100">
              <td className="py-3 px-4">{formatNZDate(new Date(transaction.date))}</td>
              <td className="py-3 px-4">{getStudentName(transaction)}</td>
              <td className="py-3 px-4">${transaction.amount.toFixed(2)}</td>
              <td className="py-3 px-4">{transaction.otherPartyAccount}</td>
              <td className="py-3 px-4">{transaction.reference || '-'}</td>
              <td className="py-3 px-4">{transaction.code || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}