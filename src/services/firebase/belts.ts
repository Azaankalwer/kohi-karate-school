import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Belt, CreateBeltInput } from '../../types/belt';

const COLLECTION_NAME = 'lookup_belts';

export async function fetchBelts(tenantId: string): Promise<Belt[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('tenantId', '==', tenantId),
    orderBy('order', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Belt));
}

export async function addBelt(belt: CreateBeltInput, tenantId: string): Promise<Belt> {
  const beltData = {
    ...belt,
    tenantId
  };
  const docRef = await addDoc(collection(db, COLLECTION_NAME), beltData);
  return {
    id: docRef.id,
    ...beltData
  };
}

export async function updateBelt(id: string, updates: Partial<Belt>, tenantId: string): Promise<void> {
  const updateData = {
    ...updates,
    tenantId
  };
  await updateDoc(doc(db, COLLECTION_NAME, id), updateData);
}

export async function deleteBelt(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function reorderBelts(belts: Belt[], tenantId: string): Promise<void> {
  const batch = belts.map((belt, index) => 
    updateDoc(doc(db, COLLECTION_NAME, belt.id), { 
      order: index,
      tenantId 
    })
  );
  await Promise.all(batch);
}