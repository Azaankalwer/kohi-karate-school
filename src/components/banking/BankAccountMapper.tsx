import React, { useState } from 'react';
import { BankTransactionSelector } from '../BankTransactionSelector';
import { BankTransaction } from '../../types/bankTransaction';
import { BankMapping } from '../../types/bankMapping';
import { addBankMapping } from '../../services/firebase/bankMappings';
import { useTenant } from '../../contexts/TenantContext';

interface BankAccountMapperProps {
  studentId: string;
  bankTransactions: BankTransaction[];
  bankMappings: BankMapping[];
  onMappingCreated: () => void;
  triggerComponent: React.ReactNode;
}

export function BankAccountMapper({ 
  studentId, 
  bankTransactions, 
  bankMappings,
  onMappingCreated,
  triggerComponent
}: BankAccountMapperProps) {
  const [showTransactionSelector, setShowTransactionSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ top: 0, left: 0 });
       const { currentTenant } = useTenant();
        const tenantId = currentTenant?.id;

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectorPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX
    });
    setShowTransactionSelector(true);
  };

  const handleTransactionSelect = async (transaction: BankTransaction) => {
    try {
      await addBankMapping({
        studentId,
        otherPartyAccount: transaction.otherPartyAccount
      },tenantId);
      onMappingCreated();
      setShowTransactionSelector(false);
    } catch (error) {
      console.error('Error creating bank mapping:', error);
    }
  };

  return (
    <>
      <div onClick={handleClick}>
        {triggerComponent}
      </div>
      
      {showTransactionSelector && (
        <BankTransactionSelector
          transactions={bankTransactions}
          onSelect={handleTransactionSelect}
          onClose={() => setShowTransactionSelector(false)}
          position={selectorPosition}
        />
      )}
    </>
  );
}