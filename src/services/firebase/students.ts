import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Student } from '../../types/student';

const COLLECTION_NAME = 'students';

export async function fetchStudents(tenantId: string): Promise<Student[]> {
  try {
    console.log('Fetching students for tenant:', tenantId); // Debug log
    const q = query(
      collection(db, COLLECTION_NAME),
      where('tenantId', '==', tenantId)
    );
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));
    console.log('Found students:', students.length); // Debug log
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export async function addStudent(student: Omit<Student, 'id'>, tenantId: string): Promise<Student> {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const studentData = {
    ...student,
    tenantId,
    emergencyContact: {
      name: student.emergencyContact?.name || '',
      phone: student.emergencyContact?.phone || ''
    },
    status: student.status || 'Active',
    medicalNotes: student.medicalNotes || ''
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), studentData);
    return {
      id: docRef.id,
      ...studentData
    };
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
}

export async function updateStudent(student: Student, tenantId: string): Promise<void> {
  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  const { id, ...data } = student;
  const studentData = {
    ...data,
    tenantId
  };

  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), studentData);
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}