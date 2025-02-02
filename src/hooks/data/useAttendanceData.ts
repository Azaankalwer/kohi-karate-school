import { useState, useEffect } from 'react';
import { Attendance } from '../../types/attendance';
import { fetchAttendance, addAttendance } from '../../services/firebase/attendance';
import { getNZDateTimeString } from '../../utils/dateTime';

export function useAttendanceData(tenantId: string | null) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!tenantId) return;
      try {
        setIsLoading(true);
        const loadedAttendance = await fetchAttendance(tenantId);
        setAttendance(loadedAttendance);
      } catch (error) {
        console.error('Error loading attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendance();
  }, [tenantId]);

  const handleCheckIn = async (studentId: string, selectedDate: string, classId?: string) => {
    if (!tenantId) return;
    try {
      const { time: checkinTime } = getNZDateTimeString();
      const newAttendance = await addAttendance({
        studentId,
        classDate: selectedDate,
        checkinTime,
        classId
      }, tenantId);

      setAttendance(prev => [...prev, newAttendance]);
    } catch (error) {
      console.error('Error checking in student:', error);
      throw error;
    }
  };

  return {
    attendance,
    isLoading,
    handleCheckIn
  };
}