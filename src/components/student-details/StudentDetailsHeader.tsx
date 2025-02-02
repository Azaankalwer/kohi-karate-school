import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface StudentDetailsHeaderProps {
  onClose: () => void;
  onDelete?: () => void;
}

export function StudentDetailsHeader({ onClose, onDelete }: StudentDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Student Details
      </h2>
      <div className="flex items-center gap-2">
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 p-2"
            title="Delete Student"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}