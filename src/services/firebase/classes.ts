import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { KarateClass } from '../../types/class';

const COLLECTION_NAME = 'classes';

export async function fetchClasses(tenantId: string): Promise<KarateClass[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('tenantId', '==', tenantId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as KarateClass));
}

export async function addClass(karateClass: Omit<KarateClass, 'id'>, tenantId: string): Promise<KarateClass> {
  const classData = {
    ...karateClass,
    tenantId
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), classData);
  return {
    id: docRef.id,
    ...classData
  };
}