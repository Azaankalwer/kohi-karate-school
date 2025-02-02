export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  payee: string;
  particulars?: string;
  code?: string;
  reference?: string;
  tranType: string;
  thisPartyAccount: string;
  otherPartyAccount: string;
  serial?: string;
  transactionCode: string;
  batchNumber: string;
  originatingBank: string;
  processedDate: string;
}