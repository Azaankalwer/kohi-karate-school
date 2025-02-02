import React, { useMemo } from 'react';
import { BarChart2, UserPlus, Shield, Users } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Student, calculateAge } from '../types/student';
import { Attendance } from '../types/attendance';
import { getBeltColor } from '../utils/beltColors';

interface AnalyticsTabProps {
  attendance: Attendance[];
  students: Student[];
}

export function AnalyticsTab({ attendance, students }: AnalyticsTabProps) {
  const monthlyAttendance = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(today, i));
      const monthEnd = endOfMonth(monthStart);
      const count = attendance.filter(a => {
        const attendanceDate = new Date(a.classDate);
        return attendanceDate >= monthStart && attendanceDate <= monthEnd;
      }).length;
      return {
        month: format(monthStart, 'MMM'),
        count
      };
    }).reverse();
  }, [attendance]);

  const beltDistribution = useMemo(() => {
    const distribution = students.reduce((acc, student) => {
      acc[student.beltRank] = (acc[student.beltRank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const ageDistribution = useMemo(() => {
    const ranges = [
      { label: '0-5', min: 0, max: 5 },
      { label: '6-10', min: 6, max: 10 },
      { label: '11-15', min: 11, max: 15 },
      { label: '16-20', min: 16, max: 20 },
      { label: '20-30', min: 20, max: 30 },
      { label: '30-40', min: 30, max: 40 },
      { label: '40-80', min: 40, max: 80 }
    ];

    return ranges.map(range => ({
      label: range.label,
      count: students.filter(student => {
        const age = calculateAge(student.dateOfBirth);
        return age >= range.min && age <= range.max;
      }).length
    }));
  }, [students]);

  const monthlyRegistrations = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(today, i));
      const monthEnd = endOfMonth(monthStart);
      const count = students.filter(s => {
        const registrationDate = new Date(s.joinDate);
        return registrationDate >= monthStart && registrationDate <= monthEnd;
      }).length;
      return {
        month: format(monthStart, 'MMM'),
        count
      };
    }).reverse();
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Attendance Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Attendance Trend</h2>
          </div>
          <div className="text-sm text-gray-500">Last 12 months</div>
        </div>

        <div className="h-48 flex items-end gap-2">
          {monthlyAttendance.map((month, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
              title={`${month.month}: ${month.count} attendances`}
            >
              <div className="text-sm text-gray-600 mb-1">{month.count}</div>
              <div
                className="w-full bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
                style={{
                  height: `${(month.count / Math.max(...monthlyAttendance.map(m => m.count), 1)) * 100}%`,
                  minHeight: month.count > 0 ? '4px' : '0'
                }}
              />
              <div className="text-sm text-gray-500 mt-2">{month.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Belt Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Student Belt Ranks</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {beltDistribution.map(([belt, count]) => (
            <div key={belt} className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm ${getBeltColor(belt)} flex-grow`}>
                {belt}
              </div>
              <div className="text-gray-600 font-medium">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Student Age</h2>
        </div>

        <div className="h-48 flex items-end gap-2">
          {ageDistribution.map((range, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
              title={`${range.label} years: ${range.count} students`}
            >
              <div className="text-sm text-gray-600 mb-1">{range.count}</div>
              <div
                className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                style={{
                  height: `${(range.count / Math.max(...ageDistribution.map(r => r.count), 1)) * 100}%`,
                  minHeight: range.count > 0 ? '4px' : '0'
                }}
              />
              <div className="text-sm text-gray-500 mt-2">{range.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Registrations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">Monthly Registrations</h2>
          </div>
          <div className="text-sm text-gray-500">Last 12 months</div>
        </div>

        <div className="h-48 flex items-end gap-2">
          {monthlyRegistrations.map((month, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
              title={`${month.month}: ${month.count} registrations`}
            >
              <div className="text-sm text-gray-600 mb-1">{month.count}</div>
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{
                  height: `${(month.count / Math.max(...monthlyRegistrations.map(m => m.count), 1)) * 100}%`,
                  minHeight: month.count > 0 ? '4px' : '0'
                }}
              />
              <div className="text-sm text-gray-500 mt-2">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}