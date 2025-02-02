import React from 'react';
import { User, AlertCircle } from 'lucide-react';
import { Student } from '../../../types/student';
import { BankTransaction } from '../../../types/bankTransaction';
import { BankMapping } from '../../../types/bankMapping';
import { TransactionList } from './TransactionList';
import { BankAccountMapper } from '../BankAccountMapper';
import { useUnmappedTransactions } from '../hooks/useUnmappedTransactions';

interface StudentPaymentCardProps {
  student: Student;
  transactions: BankTransaction[];
  mapping?: BankMapping;
  bankMappings: BankMapping[];
  onDataChange: () => void;
}

export function StudentPaymentCard({ 
  student, 
  transactions, 
  mapping,
  bankMappings,
  onDataChange
}: StudentPaymentCardProps) {
  const unmappedTransactions = useUnmappedTransactions(transactions, bankMappings);
  
  const studentTransactions = mapping ? 
    transactions
      .filter(t => t.otherPartyAccount === mapping.otherPartyAccount)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : 
    [];

  const canMapAccount = !mapping && unmappedTransactions.length > 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <h3 className="font-medium text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
          </div>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
      </div>

      <div className="mt-4">
        {mapping ? (
          <>
            <p className="text-sm font-medium text-gray-700">{mapping.otherPartyAccount}</p>
            {studentTransactions.length > 0 ? (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Bank Transactions</h4>
                <TransactionList transactions={studentTransactions} />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No transactions found</p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            {canMapAccount ? (
              <BankAccountMapper
                studentId={student.id}
                bankTransactions={unmappedTransactions}
                bankMappings={bankMappings}
                onMappingCreated={onDataChange}
                triggerComponent={
                  <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer">
                    No bank account mapped - Click to map
                  </span>
                }
              />
            ) : (
              <span className="text-amber-600">
                No bank account mapped
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}