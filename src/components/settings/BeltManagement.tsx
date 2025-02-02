import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, GripVertical, Save, Loader2 } from 'lucide-react';
import { Belt } from '../../types/belt';
import { fetchBelts, addBelt, updateBelt, deleteBelt, reorderBelts } from '../../services/firebase/belts';

export function BeltManagement() {
  const [belts, setBelts] = useState<Belt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBelt, setEditingBelt] = useState<Belt | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBelt, setDraggedBelt] = useState<Belt | null>(null);

  useEffect(() => {
    loadBelts();
  }, []);

  const loadBelts = async () => {
    try {
      setIsLoading(true);
      const loadedBelts = await fetchBelts();
      setBelts(loadedBelts);
    } catch (error) {
      setError('Failed to load belts');
      console.error('Error loading belts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBelt = async () => {
    try {
      const newBelt = await addBelt({
        name: 'New Belt',
        order: belts.length,
        color: '#000000',
        backgroundColor: '#FFFFFF',
        textColor: '#000000'
      });
      setBelts([...belts, newBelt]);
      setEditingBelt(newBelt);
    } catch (error) {
      setError('Failed to add belt');
      console.error('Error adding belt:', error);
    }
  };

  const handleUpdateBelt = async (belt: Belt) => {
    try {
      await updateBelt(belt.id, belt);
      setBelts(belts.map(b => b.id === belt.id ? belt : b));
      setEditingBelt(null);
    } catch (error) {
      setError('Failed to update belt');
      console.error('Error updating belt:', error);
    }
  };

  const handleDeleteBelt = async (beltId: string) => {
    try {
      await deleteBelt(beltId);
      setBelts(belts.filter(b => b.id !== beltId));
    } catch (error) {
      setError('Failed to delete belt');
      console.error('Error deleting belt:', error);
    }
  };

  const handleDragStart = (belt: Belt) => {
    setIsDragging(true);
    setDraggedBelt(belt);
  };

  const handleDragOver = (e: React.DragEvent, targetBelt: Belt) => {
    e.preventDefault();
    if (!draggedBelt || draggedBelt.id === targetBelt.id) return;

    const newBelts = [...belts];
    const draggedIndex = newBelts.findIndex(b => b.id === draggedBelt.id);
    const targetIndex = newBelts.findIndex(b => b.id === targetBelt.id);

    newBelts.splice(draggedIndex, 1);
    newBelts.splice(targetIndex, 0, draggedBelt);

    setBelts(newBelts);
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedBelt(null);

    try {
      await reorderBelts(belts);
    } catch (error) {
      setError('Failed to save belt order');
      console.error('Error saving belt order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">Belt Management</h3>
        </div>
        <button
          onClick={handleAddBelt}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Belt
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {belts.map((belt) => (
          <div
            key={belt.id}
            draggable
            onDragStart={() => handleDragStart(belt)}
            onDragOver={(e) => handleDragOver(e, belt)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 p-4 bg-white rounded-lg border ${
              isDragging ? 'border-gray-300' : 'border-gray-200'
            }`}
          >
            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
            
            {editingBelt?.id === belt.id ? (
              <div className="flex-1 grid grid-cols-4 gap-4">
                <input
                  type="text"
                  value={editingBelt.name}
                  onChange={(e) => setEditingBelt({ ...editingBelt, name: e.target.value })}
                  className="rounded-md border-gray-300"
                  placeholder="Belt name"
                />
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Border Color</label>
                  <input
                    type="color"
                    value={editingBelt.color}
                    onChange={(e) => setEditingBelt({ ...editingBelt, color: e.target.value })}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Background Color</label>
                  <input
                    type="color"
                    value={editingBelt.backgroundColor}
                    onChange={(e) => setEditingBelt({ ...editingBelt, backgroundColor: e.target.value })}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Text Color</label>
                  <input
                    type="color"
                    value={editingBelt.textColor}
                    onChange={(e) => setEditingBelt({ ...editingBelt, textColor: e.target.value })}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div 
                className="flex-1 px-3 py-1 rounded-full text-sm"
                style={{
                  color: belt.textColor,
                  backgroundColor: belt.backgroundColor,
                  border: `1px solid ${belt.color}`
                }}
              >
                {belt.name}
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingBelt?.id === belt.id ? (
                <button
                  onClick={() => handleUpdateBelt(editingBelt)}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Save changes"
                >
                  <Save className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setEditingBelt(belt)}
                  className="p-1 text-gray-600 hover:text-gray-700"
                  title="Edit belt"
                >
                  <Shield className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleDeleteBelt(belt.id)}
                className="p-1 text-red-600 hover:text-red-700"
                title="Delete belt"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}