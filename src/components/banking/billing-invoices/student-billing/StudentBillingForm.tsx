import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { StudentSearch } from '../StudentSearch';
import { BillingDetails } from './BillingDetails';
import { RecurringSettings } from './RecurringSettings';
import { InvoiceDates } from './InvoiceDates';
import { calculateNextInvoiceDate } from '../../utils/billing';
import type { StudentOption } from '../../types/student';
import { SuccessMessage } from '../common/SuccessMessage';
import { Loader2 } from 'lucide-react';

interface StudentBillingFormProps {
  initialStudentId?: string | null;
}

export function StudentBillingForm({ initialStudentId }: StudentBillingFormProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recurringType, setRecurringType] = useState<'Days' | 'Monthly'>('Days');
  const [recurringValue, setRecurringValue] = useState('15');
  const [termsDays, setTermsDays] = useState('7');
  const [lastInvoiceDate, setLastInvoiceDate] = useState<Date | null>(null);
  const [nextInvoiceDate, setNextInvoiceDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingBillingId, setExistingBillingId] = useState<string | null>(null);

  // Load billing data when initialStudentId changes
  useEffect(() => {
    async function loadBillingData() {
      if (!initialStudentId) return;

      setLoading(true);
      try {
        // Query student_billing collection directly
        const billingQuery = query(
          collection(db, 'student_billing'),
          where('studentId', '==', initialStudentId),
          where('tenantId', '==', 1)
        );
        
        const snapshot = await getDocs(billingQuery);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          
          // Set the form data
          setExistingBillingId(doc.id);
          setMonthlyAmount(data.monthlyAmount?.toString() || '');
          setDescription(data.description || '');
          setRecurringType(data.recurringType || 'Days');
          setRecurringValue(data.recurringValue?.toString() || '15');
          setTermsDays(data.termsDays?.toString() || '7');
          
          // Handle date fields
          if (data.lastInvoiceDate) {
            setLastInvoiceDate(data.lastInvoiceDate.toDate());
          }
          if (data.nextInvoiceDate) {
            setNextInvoiceDate(data.nextInvoiceDate.toDate());
          }

          // Set student info
          setSelectedStudent({
            value: data.studentId,
            label: data.studentName,
            student: {
              id: data.studentId,
              firstName: data.studentName.split(' ')[0],
              lastName: data.studentName.split(' ')[1] || ''
            }
          });
        }
      } catch (error) {
        console.error('Error loading billing data:', error);
        alert('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, [initialStudentId]);

  // Calculate next invoice date whenever last invoice date or recurring settings change
  useEffect(() => {
    if (lastInvoiceDate) {
      const nextDate = calculateNextInvoiceDate(
        lastInvoiceDate,
        recurringType,
        parseInt(recurringValue, 10)
      );
      setNextInvoiceDate(nextDate);
    }
  }, [lastInvoiceDate, recurringType, recurringValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const billingData = {
        studentId: selectedStudent.value,
        studentName: selectedStudent.label,
        monthlyAmount: parseFloat(monthlyAmount),
        description,
        recurringType,
        recurringValue: parseInt(recurringValue, 10),
        termsDays: parseInt(termsDays, 10),
        lastInvoiceDate,
        nextInvoiceDate,
        tenantId: 1,
        updatedAt: new Date()
      };

      if (existingBillingId) {
        await updateDoc(doc(db, 'student_billing', existingBillingId), billingData);
      } else {
        await addDoc(collection(db, 'student_billing'), {
          ...billingData,
          createdAt: new Date()
        });
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving billing record:', error);
      alert('Failed to save billing record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showSuccess && (
        <SuccessMessage
          message={existingBillingId ? "Billing record updated successfully!" : "Billing record created successfully!"}
          onDismiss={() => setShowSuccess(false)}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Student</label>
        <StudentSearch
          onSelect={setSelectedStudent}
          placeholder="Search for a student..."
          initialValue={selectedStudent}
          disabled={!!initialStudentId}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading billing data...</span>
        </div>
      ) : (
        <>
          <BillingDetails
            amount={monthlyAmount}
            description={description}
            termsDays={termsDays}
            onAmountChange={setMonthlyAmount}
            onDescriptionChange={setDescription}
            onTermsDaysChange={setTermsDays}
          />

          <RecurringSettings
            type={recurringType}
            value={recurringValue}
            onTypeChange={setRecurringType}
            onValueChange={setRecurringValue}
          />

          <InvoiceDates
            lastInvoiceDate={lastInvoiceDate}
            nextInvoiceDate={nextInvoiceDate}
            onLastInvoiceDateChange={setLastInvoiceDate}
            onNextInvoiceDateChange={setNextInvoiceDate}
            isNextDateReadOnly={true}
          />

          <button
            type="submit"
            disabled={loading || !selectedStudent}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingBillingId ? 'Update Billing Record' : 'Create Billing Record'}
          </button>
        </>
      )}
    </form>
  );
}