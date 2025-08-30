import { CheckCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OutfitItem {
  name: string;
  color: string;
  type: string;
}

export interface OutfitSuggestion {
  id: string;
  items: OutfitItem[];
  confidence: number;
}

interface OutfitCardProps {
  outfit: OutfitSuggestion;
  index: number;
}

export const OutfitCard = ({
  outfit,
  index
}: OutfitCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 75) return 'text-primary';
    return 'text-accent';
  };

  const getConfidenceGlow = (confidence: number) => {
    if (confidence >= 90) return 'glow-secondary';
    if (confidence >= 75) return 'glow-primary';
    return 'glow-accent';
  };

  return (
    <Card key={outfit.id} className="glass-card glass-card-hover p-6 rounded-2xl transition-all duration-300" style={{
      animationDelay: `${index * 150}ms`
    }}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Outfit {index + 1}</h3>
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Items:</p>
          {outfit.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center space-x-3 p-3 glass-card rounded-lg">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="capitalize font-medium">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">AI Confidence:</span>
            <span className={`font-bold ${getConfidenceColor(outfit.confidence)}`}>
              {outfit.confidence}%
            </span>
          </div>
          <Progress value={outfit.confidence} className={`h-3 ${getConfidenceGlow(outfit.confidence)}`} />
        </div>
      </div>
    </Card>
  );
};
