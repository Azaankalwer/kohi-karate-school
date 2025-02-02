import React, { useMemo } from 'react';
import { ClipboardList, Calendar, Trash2, Users } from 'lucide-react';
import { Attendance } from '../types/attendance';
import { Student, calculateAge } from '../types/student';
import { KarateClass } from '../types/class';
import { getBeltColor } from '../utils/beltColors';
import { formatNZDate, formatNZTime } from '../utils/dateTime';

interface AttendanceListProps {
  attendance: Attendance[];
  students: Student[];
  classes: KarateClass[];
  onRemoveAttendance?: (attendanceId: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function AttendanceList({ 
  attendance, 
  students, 
  classes, 
  onRemoveAttendance,
  selectedDate,
  onDateChange
}: AttendanceListProps) {
  const getStudent = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  // Get unique dates from both attendance records and classes
  const uniqueDates = useMemo(() => {
    const attendanceDates = attendance.map(a => a.classDate);
    const classDates = classes.map(c => c.date);
    const allDates = [...new Set([...attendanceDates, ...classDates])];
    return allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [attendance, classes]);

  const selectedClassAttendance = useMemo(() => {
    return attendance
      .filter(a => a.classDate === selectedDate)
      .sort((a, b) => {
        const studentA = getStudent(a.studentId);
        const studentB = getStudent(b.studentId);
        if (!studentA || !studentB) return 0;
        return `${studentA.lastName} ${studentA.firstName}`.localeCompare(
          `${studentB.lastName} ${studentB.firstName}`
        );
      });
  }, [attendance, selectedDate, students]);

 const formatDate = (dateStr: string) => {
    console.log("Date string:", dateStr);
  
    if (!dateStr) {
      return "Invalid date";  
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "Invalid date";  
    }
  
    return formatNZDate(date);
  };

  const getClassName = (classDate: string) => {
    const classRecord = classes.find(c => c.date === classDate);
    return classRecord ? classRecord.name : `Class: ${formatDate(classDate)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {getClassName(selectedDate)}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>Students present: {selectedClassAttendance.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
          >
            {uniqueDates.map(date => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {selectedClassAttendance.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No attendance records for this class</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Belt</th>
                <th className="py-3 px-4 text-left">Age</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Check-in Time</th>
                {onRemoveAttendance && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {selectedClassAttendance.map((record) => {
                const student = getStudent(record.studentId);
                if (!student) return null;
                
                const uniqueKey = `${record.id}-${student.id}-${record.classDate}`;
                
                return (
                  <tr key={uniqueKey} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      {student.lastName}, {student.firstName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getBeltColor(student.beltRank)}`}>
                        {student.beltRank}
                      </span>
                    </td>
                    <td className="py-3 px-4">{calculateAge(student.dateOfBirth)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.type === 'Trial' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.type || 'Student'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{record.checkinTime}</td>
                    {onRemoveAttendance && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onRemoveAttendance(record.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove from attendance"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}