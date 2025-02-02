import { Student, BELT_RANKS, calculateAge } from '../types/student';
import { StudentStats } from './studentStats';
import { SortField } from '../types/sorting';

export function compareStudents(
  a: Student,
  b: Student,
  statsA: StudentStats,
  statsB: StudentStats,
  sortField: SortField
): number {
  switch (sortField) {
    case 'name':
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    case 'belt':
      return BELT_RANKS.indexOf(a.beltRank) - BELT_RANKS.indexOf(b.beltRank);
    case 'age':
      return calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth);
    case 'status':
      return a.status.localeCompare(b.status);
    case 'joinDate':
      return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    case 'lastClass':
      const lastClassA = statsA.lastClass?.getTime() || 0;
      const lastClassB = statsB.lastClass?.getTime() || 0;
      return lastClassA - lastClassB;
    case 'payments3m':
      return statsA.payments3m - statsB.payments3m;
    case 'payments6m':
      return statsA.payments6m - statsB.payments6m;
    default:
      return 0;
  }
}