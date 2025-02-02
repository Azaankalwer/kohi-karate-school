import { useState, useEffect } from 'react';
import { Student } from '../../../types/student';
import { BankTransaction } from '../../../types/bankTransaction';
import { BankMapping } from '../../../types/bankMapping';
import { fetchBankTransactions } from '../../../services/firebase/bankTransactions';
import { fetchBankMappings } from '../../../services/firebase/bankMappings';
import { fetchStudents } from '../../../services/firebase/students';
import { useTenant } from '../../../contexts/TenantContext';

export function useBankData() {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [mappings, setMappings] = useState<BankMapping[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [loadedTransactions, loadedMappings, loadedStudents] = await Promise.all([
        fetchBankTransactions(tenantId),
        fetchBankMappings(tenantId),
        fetchStudents(tenantId)
      ]);
      setTransactions(loadedTransactions);
      setMappings(loadedMappings);
      setStudents(loadedStudents);
    } catch (error) {
      setError('Failed to load banking data. Please try again.');
      console.error('Error loading bank data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    transactions,
    mappings,
    students,
    isLoading,
    error,
    reloadData: loadData
  };
}