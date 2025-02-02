import React, { useState, useMemo } from 'react';
import { Users, Filter } from 'lucide-react';
import { Student } from '../types/student';
import { Attendance } from '../types/attendance';
import { BankTransaction } from '../types/bankTransaction';
import { BankMapping } from '../types/bankMapping';
import { StudentListHeader } from './StudentListHeader';
import { StudentListRow } from './StudentListRow';
import { getStudentStats } from '../utils/studentStats';
import { compareStudents } from '../utils/studentSort';
import { SortField, SortDirection } from '../types/sorting';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  attendance?: Attendance[];
  bankTransactions?: BankTransaction[];
  bankMappings?: BankMapping[];
  onDataChange: () => void;
}

export function StudentList({ 
  students, 
  onSelectStudent, 
  attendance = [], 
  bankTransactions = [],
  bankMappings = [],
  onDataChange
}: StudentListProps) {
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Old' | 'All'>('Active');
  const [beltFilter, setBeltFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const studentCounts = useMemo(() => {
    const active = students.filter(s => s.status !== 'Old').length;
    const old = students.filter(s => s.status === 'Old').length;
    return {
      total: students.length,
      active,
      old
    };
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];
    
    // Apply status filter
    if (statusFilter === 'Old') {
      filtered = filtered.filter(student => student.status === 'Old');
    } else if (statusFilter === 'Active') {
      filtered = filtered.filter(student => student.status !== 'Old');
    }

    // Apply belt filter
    if (beltFilter !== 'All') {
      filtered = filtered.filter(student => student.beltRank === beltFilter);
    }

    // Apply type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(student => student.type === typeFilter);
    }

    // Sort students
    return filtered.sort((a, b) => {
      const statsA = getStudentStats(a.id, attendance, bankTransactions, bankMappings);
      const statsB = getStudentStats(b.id, attendance, bankTransactions, bankMappings);
      const comparison = compareStudents(a, b, statsA, statsB, sortField);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [students, statusFilter, beltFilter, typeFilter, sortField, sortDirection, attendance, bankTransactions, bankMappings]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Students</h2>
          </div>
          <div className="text-sm text-gray-600">
            Total: {studentCounts.total} (Active: {studentCounts.active}, Old: {studentCounts.old})
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'Active' | 'Old' | 'All')}
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
            >
              <option value="Active">Active</option>
              <option value="Old">Old</option>
              <option value="All">All Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <StudentListHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            beltFilter={beltFilter}
            onBeltFilterChange={setBeltFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
          <tbody>
            {filteredAndSortedStudents.map((student) => {
              const stats = getStudentStats(
                student.id,
                attendance,
                bankTransactions,
                bankMappings
              );
              
              return (
                <StudentListRow
                  key={student.id}
                  student={student}
                  stats={stats}
                  onSelectStudent={onSelectStudent}
                  bankTransactions={bankTransactions}
                  bankMappings={bankMappings}
                  onBankMappingCreated={onDataChange}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}