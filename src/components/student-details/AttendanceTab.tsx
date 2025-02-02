import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ClipboardList } from 'lucide-react';
import { Attendance } from '../../types/attendance';
import { Settings } from '../../types/settings';
import { formatNZDate } from '../../utils/dateTime';

interface AttendanceTabProps {
  studentId: string;
  attendance: Attendance[];
  settings: Settings;
}

export function AttendanceTab({ studentId, attendance, settings }: AttendanceTabProps) {
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  const totalClasses = studentAttendance.length;
  const classesSinceGrading = settings.lastGradingDate ? 
    studentAttendance.filter(a => new Date(a.classDate) > new Date(settings.lastGradingDate)).length : 0;

  // Calculate monthly attendance for chart
  const monthlyAttendance = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const monthStart = new Date(year, date.getMonth(), 1);
    const monthEnd = new Date(year, date.getMonth() + 1, 0);
    
    const count = studentAttendance.filter(a => {
      const attendanceDate = new Date(a.classDate);
      return attendanceDate >= monthStart && attendanceDate <= monthEnd;
    }).length;

    return { month, count };
  }).reverse();

  const chartData = {
    labels: monthlyAttendance.map(m => m.month),
    datasets: [{
      label: 'Classes Attended',
      data: monthlyAttendance.map(m => m.count),
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Classes: ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Attendance Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Total Classes</p>
            <p className="text-2xl font-semibold text-gray-900">{totalClasses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Classes Since Grading</p>
            <p className="text-2xl font-semibold text-gray-900">{classesSinceGrading}</p>
          </div>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}