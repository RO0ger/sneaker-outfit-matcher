import { useState } from 'react';
import { Plus, X, Shirt, Package, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface WardrobeItem {
  id: string;
  name: string;
  color: string;
  type: string;
}

interface WardrobeManagerProps {
  onClose: () => void;
}

export const WardrobeManager = ({ onClose }: WardrobeManagerProps) => {
  const [items, setItems] = useState<WardrobeItem[]>([
    { id: '1', name: 'black jeans', color: 'Black', type: 'bottom' },
    { id: '2', name: 'black diesel tee', color: 'Black', type: 'top' },
    { id: '3', name: 'blue omega watch', color: 'Blue', type: 'accessory' },
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    color: '',
    type: 'top'
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = () => {
    if (newItem.name && newItem.color) {
      const item: WardrobeItem = {
        id: Date.now().toString(),
        name: newItem.name,
        color: newItem.color,
        type: newItem.type
      };
      setItems([...items, item]);
      setNewItem({ name: '', color: '', type: 'top' });
      setShowAddForm(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'top': return <Shirt className="w-4 h-4" />;
      case 'bottom': return <Package className="w-4 h-4" />;
      case 'accessory': return <Palette className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Wardrobe</h2>
              <p className="text-muted-foreground">Manage your clothing items here.</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-primary/10 hover:glow-primary transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <Card className="glass-card p-6 mb-6 rounded-xl animate-slide-up">
              <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="e.g., Black Nike hoodie"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="glass-card border-primary/20 focus:border-primary focus:glow-primary transition-all duration-300"
                />
                <Input
                  placeholder="e.g., Black"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  className="glass-card border-primary/20 focus:border-primary focus:glow-primary transition-all duration-300"
                />
                <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                  <SelectTrigger className="glass-card border-primary/20 focus:border-primary focus:glow-primary transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-primary/20">
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddItem}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 glow-primary transition-all duration-300"
                  >
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="glass-card neon-border hover:glow-primary transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Add Item Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 glow-primary transition-all duration-300 py-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </Button>
          )}

          {/* Items List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.map((item, index) => (
              <Card 
                key={item.id} 
                className="glass-card glass-card-hover p-4 rounded-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="glass-card text-xs">
                          {item.color}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary/20">
            <p className="text-sm text-muted-foreground">
              {items.length} items in your wardrobe
            </p>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 glow-primary transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};