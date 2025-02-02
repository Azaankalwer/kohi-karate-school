import React, { useState } from 'react';
import { Student } from '../types/student';
import { getBeltColor } from '../utils/beltColors';

interface StudentSearchProps {
  students: Student[];
  onSelect: (student: Student) => void;
  excludeStudentIds?: string[];
}

export function StudentSearch({ students, onSelect, excludeStudentIds = [] }: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students
    .filter(student => 
      !excludeStudentIds.includes(student.id) &&
      student.status !== 'Old' &&
      (student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Search student..."
      />
      
      {searchQuery && (
        <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="p-2 cursor-pointer hover:bg-gray-50"
              onClick={() => onSelect(student)}
            >
              <div className="font-medium">
                {student.lastName}, {student.firstName}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-sm ${getBeltColor(student.beltRank)}`}>
                  {student.beltRank}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  student.type === 'Trial' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {student.type || 'Student'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}