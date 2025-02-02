import { useState, useEffect } from 'react';
import { Promotion } from '../types/promotion';
import { fetchPromotions, addPromotion as addPromotionApi, deletePromotion as deletePromotionApi } from '../services/firebase/promotions';

export function usePromotions(studentId: string) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setIsLoading(true);
        const loadedPromotions = await fetchPromotions(studentId);
        setPromotions(loadedPromotions);
      } catch (error) {
        setError('Failed to load promotions');
        console.error('Error loading promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, [studentId]);

  const addPromotion = async (belt: string, date: string) => {
    try {
      const newPromotion = await addPromotionApi({
        studentId,
        belt,
        date
      });
      setPromotions(prev => [...prev, newPromotion]);
    } catch (error) {
      console.error('Error adding promotion:', error);
      throw error;
    }
  };

  const deletePromotion = async (promotionId: string) => {
    try {
      await deletePromotionApi(promotionId);
      setPromotions(prev => prev.filter(p => p.id !== promotionId));
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  };

  return {
    promotions,
    isLoading,
    error,
    addPromotion,
    deletePromotion
  };
}