import { Student } from '../types/student';
import { BankTransaction } from '../types/bankTransaction';
import { BankMapping } from '../types/bankMapping';
import { formatNZDate } from './dateTime';

interface PaymentSummaryRow {
  studentName: string;
  email: string;
  account: string;
  payments: string;
}

export function generatePaymentSummaryCSV(
  students: Student[],
  transactions: BankTransaction[],
  mappings: BankMapping[]
): string {
  const headers = ['Student Name', 'Email', 'Account', 'Payments'];

  const rows: PaymentSummaryRow[] = students
    .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`))
    .map(student => {
      const mapping = mappings.find(m => m.studentId === student.id);
      const studentTransactions = mapping ? 
        transactions
          .filter(t => t.otherPartyAccount === mapping.otherPartyAccount)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : 
        [];

      const payments = studentTransactions
        .map(t => `(${formatNZDate(new Date(t.date))}:$${t.amount.toFixed(2)})`)
        .join(' - ');

      return {
        studentName: `${student.firstName} ${student.lastName}`,
        email: student.email,
        account: mapping?.otherPartyAccount || 'No account mapped',
        payments: payments || 'No payments'
      };
    });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => [
      `"${row.studentName}"`,
      `"${row.email}"`,
      `"${row.account}"`,
      `"${row.payments}"`
    ].join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}