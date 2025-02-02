import { useState, useMemo } from 'react';
import { BankTransaction } from '../../../../types/bankTransaction';
import { BankMapping } from '../../../../types/bankMapping';
import { Student } from '../../../../types/student';
import { DateRange, PaymentAuditSummaryData } from '../types';

export function usePaymentAudit(
  transactions: BankTransaction[],
  mappings: BankMapping[],
  students: Student[]
) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [studentFilter, setStudentFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Date filter
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;

      // Student filter
      let matchesStudent = true;
      if (studentFilter) {
        const mapping = mappings.find(m => m.otherPartyAccount === transaction.otherPartyAccount);
        matchesStudent = mapping?.studentId === studentFilter;
      }

      return isInDateRange && matchesStudent;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dateRange, studentFilter, mappings]);

  const summary = useMemo((): PaymentAuditSummaryData => {
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = filteredTransactions.length;
    
    const uniqueAccounts = new Set(filteredTransactions.map(t => t.otherPartyAccount));
    const uniqueStudentIds = new Set(
      Array.from(uniqueAccounts).map(account => {
        const mapping = mappings.find(m => m.otherPartyAccount === account);
        return mapping?.studentId;
      }).filter(Boolean)
    );

    return {
      totalAmount,
      totalPayments,
      uniqueStudents: uniqueStudentIds.size
    };
  }, [filteredTransactions, mappings]);

  return {
    filteredTransactions,
    dateRange,
    studentFilter,
    setDateRange,
    setStudentFilter,
    summary
  };
}