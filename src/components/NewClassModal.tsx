import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';

interface NewClassModalProps {
  onClose: () => void;
  onCreateClass: (className: string, date: string) => void;
}

export function NewClassModal({ onClose, onCreateClass }: NewClassModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const defaultClassName = `Karate-${new Date().toLocaleDateString('en-GB')}`;
  
  const [className, setClassName] = useState(defaultClassName);
  const [classDate, setClassDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateClass(className, classDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Class</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Class Date</label>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}