import { useMemo } from 'react';
import { BankTransaction } from '../../../types/bankTransaction';
import { BankMapping } from '../../../types/bankMapping';

export function useUnmappedTransactions(
  transactions: BankTransaction[] = [],
  mappings: BankMapping[] = []
) {
  return useMemo(() => {
    // Get all mapped account numbers
    const mappedAccounts = new Set(mappings.map(m => m.otherPartyAccount));

    // Filter transactions to only include those with unmapped accounts
    return transactions.filter(t => !mappedAccounts.has(t.otherPartyAccount));
  }, [transactions, mappings]);
}