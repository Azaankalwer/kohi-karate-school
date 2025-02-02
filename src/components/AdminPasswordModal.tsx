import React from 'react';
import { Lock, X } from 'lucide-react';

interface AdminPasswordModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminPasswordModal({ onSuccess, onCancel }: AdminPasswordModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            Switch to Admin Mode
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to switch to admin mode? This will give you access to additional features and settings.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Continue to Admin Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}