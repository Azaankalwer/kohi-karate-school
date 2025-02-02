import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { BankTransaction } from '../types/bankTransaction';
import { formatNZDate } from '../utils/dateTime';
import { usePositioning } from '../hooks/usePositioning';

interface BankTransactionSelectorProps {
  transactions: BankTransaction[];
  onSelect: (transaction: BankTransaction) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

function TransactionDetails({ transaction }: { transaction: BankTransaction }) {
  return (
    <div className="space-y-1 mt-1 text-sm text-gray-500">
      {transaction.code && (
        <div>
          <span className="font-medium">Code:</span> {transaction.code}
        </div>
      )}
      {transaction.particulars && (
        <div>
          <span className="font-medium">Particulars:</span> {transaction.particulars}
        </div>
      )}
      {transaction.reference && (
        <div>
          <span className="font-medium">Reference:</span> {transaction.reference}
        </div>
      )}
    </div>
  );
}

export function BankTransactionSelector({ 
  transactions, 
  onSelect, 
  onClose,
  position 
}: BankTransactionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { adjustedPosition } = usePositioning(containerRef, position);

  const filteredTransactions = transactions.filter(transaction => 
    transaction.otherPartyAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (transaction.particulars && transaction.particulars.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (transaction.code && transaction.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div 
      ref={containerRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-[80vh] flex flex-col"
      style={{ 
        top: adjustedPosition.top,
        left: adjustedPosition.left,
        zIndex: 50
      }}
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Select Bank Transaction</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            autoFocus
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredTransactions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No unmapped transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => onSelect(transaction)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.otherPartyAccount}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.payee}
                  </div>
                  <TransactionDetails transaction={transaction} />
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatNZDate(new Date(transaction.date))}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}