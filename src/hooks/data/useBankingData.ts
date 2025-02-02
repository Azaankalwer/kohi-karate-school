import { useState, useEffect } from 'react';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { fetchBankTransactions } from '../../services/firebase/bankTransactions';
import { fetchBankMappings } from '../../services/firebase/bankMappings';

export function useBankingData(tenantId: string | null) {
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [bankMappings, setBankMappings] = useState<BankMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBankingData = async () => {
      if (!tenantId) return;
      try {
        setIsLoading(true);
        const [transactions, mappings] = await Promise.all([
          fetchBankTransactions(tenantId),
          fetchBankMappings(tenantId)
        ]);
        setBankTransactions(transactions);
        setBankMappings(mappings);
      } catch (error) {
        console.error('Error loading banking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBankingData();
  }, [tenantId]);

  return {
    bankTransactions,
    bankMappings,
    isLoading
  };
}