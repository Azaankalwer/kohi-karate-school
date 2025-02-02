import React from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { Promotion } from '../types/promotion';
import { formatNZDate } from '../utils/dateTime';
import { useBeltRanks } from '../hooks/useBeltRanks';

interface BeltRankingHistoryProps {
  promotions: Promotion[];
  onDelete: (promotionId: string) => void;
}

export function BeltRankingHistory({ promotions, onDelete }: BeltRankingHistoryProps) {
  const { belts } = useBeltRanks();
  const sortedPromotions = [...promotions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="font-medium text-gray-900">Belt Ranking History</h3>
      </div>

      {sortedPromotions.length === 0 ? (
        <p className="text-gray-500 text-sm">No belt ranking history available.</p>
      ) : (
        <div className="space-y-2">
          {sortedPromotions.map((promotion) => {
            const belt = belts.find(b => b.name === promotion.belt);
            return (
              <div
                key={promotion.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      color: belt?.textColor,
                      backgroundColor: belt?.backgroundColor,
                      border: `1px solid ${belt?.color || 'transparent'}`
                    }}
                  >
                    {promotion.belt}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatNZDate(new Date(promotion.date))}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(promotion.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove promotion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}