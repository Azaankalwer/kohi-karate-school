import React, { useState } from 'react';
import { CheckInForm } from './CheckInForm';
import { AttendanceList } from './AttendanceList';
import { NewClassModal } from './NewClassModal';
import { Student } from '../types/student';
import { Attendance } from '../types/attendance';
import { KarateClass } from '../types/class';
import { Plus } from 'lucide-react';
import { useAppMode } from '../contexts/AppModeContext';
import { getNZDateTimeString } from '../utils/dateTime';

interface AttendanceTabProps {
  students: Student[];
  attendance: Attendance[];
  classes: KarateClass[];
  onCheckIn: (studentId: string, selectedDate: string, classId?: string) => void;
  onCreateClass: (className: string, date: string) => void;
  onRemoveAttendance: (attendanceId: string) => void;
}

export function AttendanceTab({ 
  students, 
  attendance, 
  classes,
  onCheckIn, 
  onCreateClass,
  onRemoveAttendance 
}: AttendanceTabProps) {
  const [showNewClassModal, setShowNewClassModal] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getNZDateTimeString().date);
  const { mode } = useAppMode();

  const selectedClass = classes.find(c => c.date === selectedDate);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleCheckIn = (studentId: string) => {
    onCheckIn(studentId, selectedDate, selectedClass?.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <CheckInForm 
          students={students} 
          attendance={attendance}
          onCheckIn={handleCheckIn}
          selectedClass={selectedClass}
          selectedDate={selectedDate}
        />
        {mode === 'admin' && (
          <button
            onClick={() => setShowNewClassModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Class
          </button>
        )}
      </div>
      
      <AttendanceList 
        attendance={attendance}
        students={students}
        classes={classes}
        onRemoveAttendance={mode === 'admin' ? onRemoveAttendance : undefined}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {showNewClassModal && (
        <NewClassModal
          onClose={() => setShowNewClassModal(false)}
          onCreateClass={onCreateClass}
        />
      )}
    </div>
  );
}