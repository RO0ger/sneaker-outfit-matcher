'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OutfitItem {
  name: string;
  owned: boolean;
}

interface Outfit {
  items: OutfitItem[];
  occasion: string;
  confidence: number;
}

interface OutfitCardProps {
  outfit: Outfit;
  index: number;
}

export function OutfitCard({ outfit, index }: OutfitCardProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="text-white">
        <div className="flex justify-between items-start">
          <CardTitle>Outfit {index + 1}</CardTitle>
          <Badge variant="outline" className="capitalize border-white/50 text-white">
            {outfit.occasion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-white">
        <div>
          <h4 className="font-semibold mb-2">Items:</h4>
          <div className="flex flex-wrap gap-2">
            {outfit.items.map((item, itemIndex) => (
              <span 
                key={itemIndex} 
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  item.owned 
                    ? 'bg-green-500/20 text-green-200 border-green-400/50' 
                    : 'bg-orange-500/20 text-orange-200 border-orange-400/50'
                }`}
              >
                {item.name}
                <span className="ml-1.5 text-xs">
                  {item.owned ? '✓' : '🛒'}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div>
           <h4 className="font-semibold mb-2">AI Confidence:</h4>
           <div className="w-full bg-gray-200/30 rounded-full h-2.5">
             <div 
               className="bg-blue-400 h-2.5 rounded-full" 
               style={{ width: `${Math.round(outfit.confidence * 100)}%` }}
             ></div>
           </div>
           <p className="text-sm text-right mt-1 text-gray-300">{Math.round(outfit.confidence * 100)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
