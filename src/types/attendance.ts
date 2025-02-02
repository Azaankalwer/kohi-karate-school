export interface Attendance {
  id: string;
  studentId: string;
  classDate: string;
  checkinTime: string;
  classId?: string | null;
}