import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Student } from '../types/student';
import { getBeltColor } from '../utils/beltColors';
import { BankTransactionSelector } from './BankTransactionSelector';
import { BankTransaction } from '../types/bankTransaction';
import { BankMapping } from '../types/bankMapping';
import { addBankMapping } from '../services/firebase/bankMappings';
import { useUnmappedTransactions } from './banking/hooks/useUnmappedTransactions';
import { formatNZDate } from '../utils/dateTime';
import { useTenant } from '../contexts/TenantContext';

interface StudentListRowProps {
  student: Student;
  stats: {
    totalClasses: number;
    classesSinceGrading: number;
    lastClass: Date | null;
    daysAgo: number;
    payments3m: number;
    payments6m: number;
    hasBank: boolean;
  };
  onSelectStudent: (student: Student) => void;
  bankTransactions: BankTransaction[];
  bankMappings: BankMapping[];
  onBankMappingCreated: () => void;
}

export function StudentListRow({ 
  student, 
  stats, 
  onSelectStudent,
  bankTransactions = [],
  bankMappings = [],
  onBankMappingCreated
}: StudentListRowProps) {
  const [showTransactionSelector, setShowTransactionSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });
     const { currentTenant } = useTenant();
      const tenantId = currentTenant?.id;

  const unmappedTransactions = useUnmappedTransactions(bankTransactions, bankMappings);

  const handleBankClick = (event: React.MouseEvent) => {
    if (!stats.hasBank && unmappedTransactions.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSelectorPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX
      });
      setShowTransactionSelector(true);
    }
  };

  const handleTransactionSelect = async (transaction: BankTransaction) => {
    try {
      await addBankMapping({
        studentId: student.id,
        otherPartyAccount: transaction.otherPartyAccount
      },tenantId);
      onBankMappingCreated();
      setShowTransactionSelector(false);
    } catch (error) {
      console.error('Error creating bank mapping:', error);
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        {student.lastName}, {student.firstName}
      </td>
      <td className="py-3 px-4">
        <span className={`px-3 py-1 rounded-full text-sm ${getBeltColor(student.beltRank)}`}>
          {student.beltRank}
        </span>
      </td>
      <td className="py-3 px-4">
        {stats.lastClass ? formatNZDate(stats.lastClass) : '-'}
      </td>
      <td className="py-3 px-4">{stats.totalClasses}</td>
      <td className="py-3 px-4">{stats.classesSinceGrading}</td>
      <td className="py-3 px-4">{stats.daysAgo}</td>
      <td className="py-3 px-4">{stats.payments3m}</td>
      <td className="py-3 px-4">{stats.payments6m}</td>
      <td className="py-3 px-4 relative">
        <button
          onClick={handleBankClick}
          className={`flex items-center gap-1 ${
            stats.hasBank 
              ? 'text-green-600 cursor-default' 
              : unmappedTransactions.length > 0
                ? 'text-gray-400 hover:text-gray-600 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
          }`}
          disabled={stats.hasBank || unmappedTransactions.length === 0}
        >
          <Wallet className="w-4 h-4" />
          {stats.hasBank ? 'Yes' : 'No'}
        </button>
        {showTransactionSelector && (
          <BankTransactionSelector
            transactions={unmappedTransactions}
            onSelect={handleTransactionSelect}
            onClose={() => setShowTransactionSelector(false)}
            position={selectorPosition}
          />
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          student.type === 'Trial' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {student.type || 'Student'}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200"
          onClick={() => onSelectStudent(student)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
}