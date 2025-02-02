import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Student } from '../../../types/student';
import { DateRange } from './types';

interface PaymentAuditFiltersProps {
  dateRange: DateRange;
  studentFilter: string;
  onDateRangeChange: (range: DateRange) => void;
  onStudentFilterChange: (studentId: string) => void;
  students: Student[];
}

export function PaymentAuditFilters({
  dateRange,
  studentFilter,
  onDateRangeChange,
  onStudentFilterChange,
  students
}: PaymentAuditFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="w-64">
        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <select
            value={studentFilter}
            onChange={(e) => onStudentFilterChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}