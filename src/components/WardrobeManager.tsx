'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem, buttonVariants } from '@/lib/animations';

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
    <motion.div
      className={`bg-white rounded-lg shadow p-6 ${isInDrawer ? 'max-h-[80vh] overflow-y-auto' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        My Wardrobe
      </motion.h2>

      <motion.form
        onSubmit={handleAddItem}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="md:col-span-2" variants={staggerItem}>
          <motion.label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            Description
          </motion.label>
          <motion.input
            type="text"
            name="description"
            id="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="e.g., Black Nike hoodie"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <motion.label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            Color
          </motion.label>
          <motion.input
            type="text"
            name="color"
            id="color"
            value={newItem.color}
            onChange={handleInputChange}
            placeholder="e.g., Black"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <motion.label
            htmlFor="item_type"
            className="block text-sm font-medium text-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            Type
          </motion.label>
          <motion.select
            name="item_type"
            id="item_type"
            value={newItem.item_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200"
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
            }}
            transition={{ duration: 0.2 }}
          >
            <option>top</option>
            <option>bottom</option>
            <option>outerwear</option>
            <option>accessory</option>
          </motion.select>
        </motion.div>
        <motion.div variants={staggerItem}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
          >
            <Button type="submit" className="w-full md:w-auto">Add Item</Button>
          </motion.div>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-sm mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Loading wardrobe...
        </motion.p>
      ) : (
        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.length === 0 ? (
              <motion.p
                key="empty"
                className="text-gray-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                Your wardrobe is empty. Add some items above!
              </motion.p>
            ) : (
              displayedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(0,0,0,0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div layout>
                    <motion.p className="font-semibold" layout>{item.description}</motion.p>
                    <motion.p
                      className="text-sm text-gray-600 capitalize"
                      layout
                    >
                      {item.color} - {item.item_type}
                    </motion.p>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial="initial"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      Remove
                    </Button>
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {!showAllItems && initialLimit && items.length > initialLimit && (
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="initial"
              >
                <Button variant="link" onClick={() => setShowAllItems(true)}>
                  See All
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
