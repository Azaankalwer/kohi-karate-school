import React from 'react';
import { BankTransaction } from '../../../types/bankTransaction';
import { formatNZDate } from '../../../utils/dateTime';

interface TransactionListProps {
  transactions: BankTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-2">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="flex justify-between items-center text-sm"
        >
          <span className="text-gray-600">
            {formatNZDate(new Date(transaction.date))}
          </span>
          <span className="font-medium text-gray-900">
            ${transaction.amount.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}