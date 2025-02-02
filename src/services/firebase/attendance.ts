import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Attendance } from '../../types/attendance';

const COLLECTION_NAME = 'attendance';

export async function fetchAttendance(tenantId: string): Promise<Attendance[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('tenantId', '==', tenantId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Attendance));
}

export async function addAttendance(attendance: Omit<Attendance, 'id'>, tenantId: string): Promise<Attendance> {
  // Check for existing attendance record for this student on this date
  const q = query(
    collection(db, COLLECTION_NAME),
    where('studentId', '==', attendance.studentId),
    where('classDate', '==', attendance.classDate),
    where('tenantId', '==', tenantId)
  );
  
  const existingAttendance = await getDocs(q);
  if (!existingAttendance.empty) {
    throw new Error('Student is already checked in for this class');
  }

  const attendanceData = {
    ...attendance,
    tenantId,
    classId: attendance.classId || null
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), attendanceData);
  return {
    id: docRef.id,
    ...attendanceData
  };
}

export async function deleteAttendance(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}