import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BankTransaction } from '../../types/bankTransaction';

const COLLECTION_NAME = 'bankTransactions';

export async function fetchBankTransactions(tenantId: string): Promise<BankTransaction[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('tenantId', '==', tenantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BankTransaction));
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    throw error;
  }
}

export async function importBankTransactions(csvContent: string, tenantId: string): Promise<{
  total: number;
  imported: number;
  skipped: number;
  failed: number;
}> {
  const rows = csvContent.split('\n')
    .map(row => row.split(',')
    .map(cell => cell.replace(/^"|"$/g, '').trim()));

  const transactions = rows.slice(1).filter(row => row.length >= 14);
  
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of transactions) {
    try {
      const [date, amountStr, payee, particulars, code, reference, 
            tranType, thisPartyAccount, otherPartyAccount, serial, 
            transactionCode, batchNumber, originatingBank, processedDate] = row;

      // Check for duplicate within tenant
      console.log('Processing row:', date, amountStr, payee, tenantId);

      const q = query(
        collection(db, COLLECTION_NAME),
        where('date', '==', parseDate(date)),
        where('amount', '==', parseFloat(amountStr)),
        where('payee', '==', payee.trim()),
        where('tenantId', '==', tenantId)
      );
      
      const duplicateCheck = await getDocs(q);
      if (!duplicateCheck.empty) {
        skipped++;
        continue;
      }

      await addDoc(collection(db, COLLECTION_NAME), {
        tenantId,
        date: parseDate(date),
        amount: parseFloat(amountStr),
        payee: payee.trim(),
        particulars: particulars?.trim() || '',
        code: code?.trim() || '',
        reference: reference?.trim() || '',
        tranType: tranType?.trim() || '',
        thisPartyAccount: thisPartyAccount?.trim() || '',
        otherPartyAccount: otherPartyAccount?.trim() || '',
        serial: serial?.trim() || '',
        transactionCode: transactionCode?.trim() || '',
        batchNumber: batchNumber?.trim() || '',
        originatingBank: originatingBank?.trim() || '',
        processedDate: parseDate(processedDate)
      });

      imported++;
    } catch (error) {
      console.error('Error processing transaction:', error);
      failed++;
    }
  }

  return {
    total: transactions.length,
    imported,
    skipped,
    failed
  };
}

function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}