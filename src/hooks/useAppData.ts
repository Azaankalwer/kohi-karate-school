import { useTenant } from '../contexts/TenantContext';
import { useStudentData } from './data/useStudentData';
import { useAttendanceData } from './data/useAttendanceData';
import { useBankingData } from './data/useBankingData';
import { useClassData } from './data/useClassesData';
import { useTenantInit } from './useTenantInit';

export function useAppData() {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;

  const { isInitializing, error: initError } = useTenantInit(tenantId);
  
  const { 
    students, 
    isLoading: studentsLoading, 
    handlers: studentHandlers,
    error: studentsError
  } = useStudentData(tenantId);

  const { 
    attendance, 
    isLoading: attendanceLoading,
    error: attendanceError,
    handleCheckIn 
  } = useAttendanceData(tenantId);

  const { 
    bankTransactions, 
    bankMappings, 
    isLoading: bankingLoading,
    error: bankingError
  } = useBankingData(tenantId);

  const { 
    classes,
    isLoading: classesLoading,
    handlers: classesHandler,
    error: classesError
  } = useClassData(tenantId);

  const isLoading = isInitializing || studentsLoading || attendanceLoading || bankingLoading|| classesLoading ;
  const error = initError || studentsError || attendanceError || bankingError || classesError

  return {
    data: {
      students,
      attendance,
      bankTransactions,
      bankMappings,
      classes,
    },
    isLoading,
    error,
    handlers: {
      ...studentHandlers,
      ...classesHandler,
      handleCheckIn
    }
  };
}