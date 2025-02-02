import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Promotion } from '../../types/promotion';

const COLLECTION_NAME = 'promotions';

export async function fetchPromotions(studentId: string): Promise<Promotion[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('studentId', '==', studentId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Promotion));
}

export async function addPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), promotion);
  return {
    id: docRef.id,
    ...promotion
  };
}

export async function deletePromotion(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}