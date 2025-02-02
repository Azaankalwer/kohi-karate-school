import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Student } from '../../types/student';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { formatNZDate } from '../../utils/dateTime';

type SortField = 'date' | 'amount' | 'payee' | 'code' | 'otherPartyAccount' | 'particulars' | 'reference';

interface TransactionsTableProps {
  transactions: BankTransaction[];
  mappings: BankMapping[];
  students: Student[];
  onSelectTransaction: (transaction: BankTransaction) => void;
  isLoading: boolean;
}

function SortIcon({ field, currentField, direction }: { 
  field: SortField; 
  currentField: SortField; 
  direction: 'asc' | 'desc' 
}) {
  if (field !== currentField) return null;
  return direction === 'asc' ? 
    <ChevronUp className="w-4 h-4" /> : 
    <ChevronDown className="w-4 h-4" />;
}

export function TransactionsTable({
  transactions,
  mappings,
  students,
  onSelectTransaction,
  isLoading
}: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStudentForTransaction = (transaction: BankTransaction) => {
    const mapping = mappings.find(m => m.otherPartyAccount === transaction.otherPartyAccount);
    if (!mapping) return null;
    return students.find(s => s.id === mapping.studentId);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'payee':
        comparison = a.payee.localeCompare(b.payee);
        break;
      case 'code':
        comparison = (a.code || '').localeCompare(b.code || '');
        break;
      case 'particulars':
        comparison = (a.particulars || '').localeCompare(b.particulars || '');
        break;
      case 'reference':
        comparison = (a.reference || '').localeCompare(b.reference || '');
        break;
      case 'otherPartyAccount':
        comparison = a.otherPartyAccount.localeCompare(b.otherPartyAccount);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-1">
                Date
                <SortIcon field="date" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('amount')}
            >
              <div className="flex items-center gap-1">
                Amount
                <SortIcon field="amount" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('payee')}
            >
              <div className="flex items-center gap-1">
                Payee
                <SortIcon field="payee" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center gap-1">
                Code
                <SortIcon field="code" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('otherPartyAccount')}
            >
              <div className="flex items-center gap-1">
                Account
                <SortIcon field="otherPartyAccount" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('particulars')}
            >
              <div className="flex items-center gap-1">
                Particulars
                <SortIcon field="particulars" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="py-3 px-4 text-left cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('reference')}
            >
              <div className="flex items-center gap-1">
                Reference
                <SortIcon field="reference" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th className="py-3 px-4 text-left">Student</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            const student = getStudentForTransaction(transaction);
            return (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-3 px-4">{formatNZDate(new Date(transaction.date))}</td>
                <td className="py-3 px-4">${transaction.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{transaction.payee}</td>
                <td className="py-3 px-4">{transaction.code || '-'}</td>
                <td className="py-3 px-4">{transaction.otherPartyAccount}</td>
                <td className="py-3 px-4">{transaction.particulars || '-'}</td>
                <td className="py-3 px-4">{transaction.reference || '-'}</td>
                <td className="py-3 px-4">
                  {student ? (
                    <span className="text-gray-900">
                      {student.firstName} {student.lastName}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {!student && (
                    <button
                      onClick={() => onSelectTransaction(transaction)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Assign Student
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}