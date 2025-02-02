import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Student } from '../../types/student';
import { Belt } from '../../types/belt';
import { Promotion } from '../../types/promotion';
import { BeltRankingHistory } from '../BeltRankingHistory';

interface BeltRankingTabProps {
  student: Student;
  belts: Belt[];
  beltsLoading: boolean;
  promotions: Promotion[];
  onBeltChange: (value: string) => void;
  onAddPromotion: (belt: string, date: string) => void;
  onDeletePromotion: (promotionId: string) => void;
}

export function BeltRankingTab({
  student,
  belts,
  beltsLoading,
  promotions,
  onBeltChange,
  onAddPromotion,
  onDeletePromotion
}: BeltRankingTabProps) {
  const [promotionDate, setPromotionDate] = useState(new Date().toISOString().split('T')[0]);
  const currentBelt = belts.find(b => b.name === student.beltRank);

  const handleAddPromotion = () => {
    onAddPromotion(student.beltRank, promotionDate);
  };

  if (beltsLoading) {
    return <div>Loading belt ranks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Belt Rank</label>
        <div className="mt-1 relative">
          <select
            value={student.beltRank}
            onChange={(e) => onBeltChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 appearance-none"
            style={{
              color: currentBelt?.textColor,
              backgroundColor: currentBelt?.backgroundColor,
              border: `1px solid ${currentBelt?.color || 'transparent'}`
            }}
          >
            {belts.map(belt => (
              <option 
                key={belt.name} 
                value={belt.name}
                style={{
                  color: belt.textColor,
                  backgroundColor: belt.backgroundColor,
                  border: `1px solid ${belt.color}`
                }}
              >
                {belt.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Shield className="w-5 h-5" style={{ color: currentBelt?.textColor }} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Promotion Date</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="date"
            value={promotionDate}
            onChange={(e) => setPromotionDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddPromotion}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add to History
          </button>
        </div>
      </div>

      <BeltRankingHistory
        promotions={promotions}
        onDelete={onDeletePromotion}
      />
    </div>
  );
}