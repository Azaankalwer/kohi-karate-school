import { BankTransaction } from '../types/bankTransaction';
import { subMonths } from 'date-fns';

interface PaymentStats {
  threeMonthSum: number;
  threeMonthCount: number;
  sixMonthSum: number;
  sixMonthCount: number;
}

export function calculatePaymentStats(transactions: BankTransaction[]): PaymentStats {
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);
  const sixMonthsAgo = subMonths(today, 6);

  // Sort transactions by date in descending order
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const stats = sortedTransactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    const amount = transaction.amount;

    if (transactionDate >= threeMonthsAgo) {
      acc.threeMonthSum += amount;
      acc.threeMonthCount++;
    }
    if (transactionDate >= sixMonthsAgo) {
      acc.sixMonthSum += amount;
      acc.sixMonthCount++;
    }

    return acc;
  }, {
    threeMonthSum: 0,
    threeMonthCount: 0,
    sixMonthSum: 0,
    sixMonthCount: 0
  });

  return stats;
}