import React, { useState } from 'react';
import { Upload, Wallet, AlertCircle, Check } from 'lucide-react';
import { Student } from '../../types/student';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { TransactionsTable } from './TransactionsTable';
import { StudentMappingPanel } from './StudentMappingPanel';
import { importBankTransactions } from '../../services/firebase/bankTransactions';
import { useTenant } from '../../contexts/TenantContext';

interface TransactionsViewProps {
  transactions: BankTransaction[];
  mappings: BankMapping[];
  students: Student[];
  onDataChange: () => void;
}

export function TransactionsView({ 
  transactions, 
  mappings, 
  students, 
  onDataChange
}: TransactionsViewProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    imported: number;
    skipped: number;
    failed: number;
  } | null>(null);
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);
      setUploadStats(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const stats = await importBankTransactions(content,tenantId);
        setUploadStats(stats);
        if (stats.imported > 0) {
          setSuccess(`Successfully imported ${stats.imported} transactions`);
          onDataChange();
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Bank Transactions</h2>
        </div>

        <div className="flex items-center gap-4">
          {isUploading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Wallet className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      {uploadStats && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-medium text-gray-900 mb-2">Import Results</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium">{uploadStats.total}</p>
            </div>
            <div>
              <p className="text-gray-600">Imported</p>
              <p className="font-medium text-green-600">{uploadStats.imported}</p>
            </div>
            <div>
              <p className="text-gray-600">Skipped</p>
              <p className="font-medium text-yellow-600">{uploadStats.skipped}</p>
            </div>
            <div>
              <p className="text-gray-600">Failed</p>
              <p className="font-medium text-red-600">{uploadStats.failed}</p>
            </div>
          </div>
        </div>
      )}

      <TransactionsTable
        transactions={transactions}
        mappings={mappings}
        students={students}
        onSelectTransaction={setSelectedTransaction}
      />

      {selectedTransaction && (
        <StudentMappingPanel
          transaction={selectedTransaction}
          students={students}
          mappings={mappings}
          onClose={() => setSelectedTransaction(null)}
          onMappingCreated={onDataChange}
        />
      )}
    </div>
  );
}