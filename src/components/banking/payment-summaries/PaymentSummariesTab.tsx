import React, { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Student } from '../../../types/student';
import { BankTransaction } from '../../../types/bankTransaction';
import { BankMapping } from '../../../types/bankMapping';
import { StudentPaymentCard } from './StudentPaymentCard';
import { generatePaymentSummaryCSV, downloadCSV } from '../../../utils/paymentExport';

interface PaymentSummariesTabProps {
  students: Student[];
  transactions: BankTransaction[];
  mappings: BankMapping[];
  onDataChange: () => void;
}

export function PaymentSummariesTab({ 
  students, 
  transactions, 
  mappings,
  onDataChange
}: PaymentSummariesTabProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const sortedStudents = [...students].sort((a, b) => 
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
  );

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvContent = generatePaymentSummaryCSV(students, transactions, mappings);
      const filename = `payment_summaries_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting payment summaries:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Payment Summaries</h2>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export CSV
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {sortedStudents.map(student => (
          <StudentPaymentCard
            key={student.id}
            student={student}
            transactions={transactions}
            mapping={mappings.find(m => m.studentId === student.id)}
            bankMappings={mappings}
            onDataChange={onDataChange}
          />
        ))}
      </div>
    </div>
  );
}