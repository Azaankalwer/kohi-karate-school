import { Attendance } from '../types/attendance';
import { BankTransaction } from '../types/bankTransaction';
import { BankMapping } from '../types/bankMapping';
import { calculatePaymentStats } from './payments';
import { calculateDaysAgo } from '../types/student';

export interface StudentStats {
  totalClasses: number;
  classesSinceGrading: number;
  lastClass: Date | null;
  daysAgo: number;
  payments3m: number;
  payments6m: number;
  hasBank: boolean;
}

export function getStudentStats(
  studentId: string,
  attendance: Attendance[],
  bankTransactions: BankTransaction[],
  bankMappings: BankMapping[],
  lastGradingDate?: string
): StudentStats {
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  const totalClasses = studentAttendance.length;
  const classesSinceGrading = lastGradingDate ? 
    studentAttendance.filter(a => new Date(a.classDate) > new Date(lastGradingDate)).length : 0;
  const lastClass = studentAttendance.length > 0 ? 
    new Date(Math.max(...studentAttendance.map(a => new Date(a.classDate).getTime()))) : null;
  const daysAgo = calculateDaysAgo(lastClass);
  
  const mapping = bankMappings.find(m => m.studentId === studentId);
  const studentTransactions = mapping ? 
    bankTransactions.filter(t => t.otherPartyAccount === mapping.otherPartyAccount) : [];
  const paymentStats = calculatePaymentStats(studentTransactions);
  
  return { 
    totalClasses, 
    classesSinceGrading, 
    lastClass, 
    daysAgo,
    payments3m: paymentStats.threeMonthCount,
    payments6m: paymentStats.sixMonthCount,
    hasBank: !!mapping
  };
}