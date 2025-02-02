import React from 'react';
// import { StudentBillingForm } from './StudentBillingForm';

interface StudentBillingRecordsProps {
  initialStudentId?: string | null;
}

export function StudentBillingRecords({ initialStudentId }: StudentBillingRecordsProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Student Billing Configuration</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure billing details and schedule for students
          </p>
        </div>

        {/* <StudentBillingForm initialStudentId={initialStudentId} />st */}
      </div>
    </div>
  );
}