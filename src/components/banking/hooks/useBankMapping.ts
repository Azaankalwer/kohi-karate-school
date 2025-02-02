import { useState } from 'react';
import { addBankMapping, BankMappingError } from '../../../services/firebase/bankMappings';
import { useTenant } from '../../../contexts/TenantContext';

export function useBankMapping(onSuccess: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
       const { currentTenant } = useTenant();
        const tenantId = currentTenant?.id;
  

  const createMapping = async (studentId: string, accountNumber: string) => {
    if (!studentId || !accountNumber) {
      setError('Student ID and account number are required');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      await addBankMapping({
        studentId,
        otherPartyAccount: accountNumber
      },tenantId);

      onSuccess();
    } catch (error) {
      if (error instanceof BankMappingError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while creating the mapping');
        console.error('Bank mapping error:', error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    error,
    isProcessing,
    createMapping,
    clearError: () => setError(null)
  };
}