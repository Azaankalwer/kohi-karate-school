import React, { useState, useMemo } from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';
import { Student, calculateAge } from '../types/student';
import { KarateClass } from '../types/class';
import { useSettings } from '../contexts/SettingsContext';
import { Attendance } from '../types/attendance';
import { getBeltColor } from '../utils/beltColors';

interface CheckInFormProps {
  students: Student[];
  attendance: Attendance[];
  onCheckIn: (studentId: string, classId?: string) => void;
  selectedClass?: KarateClass;
  selectedDate: string;
}

export function CheckInForm({ students, attendance, onCheckIn, selectedClass, selectedDate }: CheckInFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const { settings } = useSettings();

  const isStudentCheckedIn = (studentId: string) => {
    return attendance.some(a => 
      a.studentId === studentId && 
      a.classDate === selectedDate
    );
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return students.filter(
      student => 
        student.status !== 'Old' && // Only show active students
        (student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query))
    );
  }, [searchQuery, students]);

  const getStudentClassCounts = (studentId: string) => {
    const totalClasses = attendance.filter(a => a.studentId === studentId).length;
    const classesSinceGrading = settings.lastGradingDate ? 
      attendance.filter(a => 
        a.studentId === studentId && 
        new Date(a.classDate) > new Date(settings.lastGradingDate)
      ).length : 0;
    return { totalClasses, classesSinceGrading };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentId && !isStudentCheckedIn(selectedStudentId)) {
      try {
        onCheckIn(selectedStudentId, selectedClass?.id);
        setSearchQuery('');
        setSelectedStudentId('');
      } catch (error) {
        console.error('Error checking in student:', error);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const className = selectedClass ? selectedClass.name : `Class: ${formatDate(selectedDate)}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Check-in to {className}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="searchStudent" className="block text-sm font-medium text-gray-700">
            Search Student
          </label>
          <input
            type="text"
            id="searchStudent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Type student name..."
          />
        </div>
        
        {searchQuery && (
          <div className="max-h-48 overflow-y-auto border rounded-md divide-y">
            {filteredStudents.map(student => {
              const age = calculateAge(student.dateOfBirth);
              const { totalClasses, classesSinceGrading } = getStudentClassCounts(student.id);
              const checkedIn = isStudentCheckedIn(student.id);
              
              return (
                <div
                  key={student.id}
                  className={`p-3 ${
                    checkedIn ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                  } ${selectedStudentId === student.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => !checkedIn && setSelectedStudentId(student.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {student.lastName}, {student.firstName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        Age: {age} • 
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
                    <div className="text-right">
                      {checkedIn ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Already checked in
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          <div>Total Classes: {totalClasses}</div>
                          {settings.lastGradingDate && (
                            <div>Since Grading: {classesSinceGrading}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedStudentId || isStudentCheckedIn(selectedStudentId)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          Check In
        </button>
      </form>
    </div>
  );
}