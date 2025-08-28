'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WardrobeItem {
  id: string;
  item_type: string;
  color: string;
  description: string;
}

interface WardrobeManagerProps {
  userId: string;
  initialLimit?: number;
  isInDrawer?: boolean;
}

export function WardrobeManager({ userId, initialLimit, isInDrawer }: WardrobeManagerProps) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [newItem, setNewItem] = useState({
    item_type: 'top',
    color: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllItems, setShowAllItems] = useState(!initialLimit);

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wardrobe?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch wardrobe items.');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWardrobe();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description.trim() || !newItem.color.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, userId })
      });

      if (!response.ok) throw new Error('Failed to add item.');
      
      setNewItem({ item_type: 'top', color: '', description: '' });
      await loadWardrobe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch('/api/wardrobe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete item.');
      
      await loadWardrobe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const displayedItems = showAllItems || !initialLimit ? items : items.slice(0, initialLimit);

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${isInDrawer ? 'max-h-[80vh] overflow-y-auto' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">My Wardrobe</h2>
      
      <form onSubmit={handleAddItem} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="e.g., Black Nike hoodie"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="text"
            name="color"
            id="color"
            value={newItem.color}
            onChange={handleInputChange}
            placeholder="e.g., Black"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="item_type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="item_type"
            id="item_type"
            value={newItem.item_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>top</option>
            <option>bottom</option>
            <option>outerwear</option>
            <option>accessory</option>
          </select>
        </div>
        <Button type="submit" className="w-full md:w-auto">Add Item</Button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p>Loading wardrobe...</p>
      ) : (
        <div className="space-y-3">
          {displayedItems.length === 0 ? (
            <p className="text-gray-500">Your wardrobe is empty. Add some items above!</p>
          ) : (
            displayedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-gray-600 capitalize">{item.color} - {item.item_type}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                  Remove
                </Button>
              </div>
            ))
          )}
          {!showAllItems && initialLimit && items.length > initialLimit && (
            <div className="text-center mt-4">
              <Button variant="link" onClick={() => setShowAllItems(true)}>
                See All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
