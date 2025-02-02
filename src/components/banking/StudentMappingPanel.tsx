import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Student } from '../../types/student';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { StudentSearch } from '../StudentSearch';
import { useBankMapping } from './hooks/useBankMapping';

interface StudentMappingPanelProps {
  transaction: BankTransaction;
  students: Student[];
  mappings: BankMapping[];
  onClose: () => void;
  onMappingCreated: () => void;
}

export function StudentMappingPanel({
  transaction,
  students,
  mappings,
  onClose,
  onMappingCreated
}: StudentMappingPanelProps) {
  const { error, isProcessing, createMapping, clearError } = useBankMapping(onMappingCreated);

  const handleAssignStudent = async (student: Student) => {
    await createMapping(student.id, transaction.otherPartyAccount);
    if (!error) {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Assign Student to Account</h3>
          <button 
            onClick={() => {
              clearError();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-3">
          Account: {transaction.otherPartyAccount}
        </p>

        {isProcessing ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <StudentSearch
            students={students}
            onSelect={handleAssignStudent}
            excludeStudentIds={mappings.map(m => m.studentId)}
          />
        )}
      </div>
    </div>
  );
}