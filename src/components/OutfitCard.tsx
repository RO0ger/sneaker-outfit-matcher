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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Outfit {index + 1}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {outfit.occasion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Items:</h4>
          <div className="flex flex-wrap gap-2">
            {outfit.items.map((item, itemIndex) => (
              <span 
                key={itemIndex} 
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  item.owned 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-orange-50 text-orange-700 border-orange-200'
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
           <div className="w-full bg-gray-200 rounded-full h-2.5">
             <div 
               className="bg-blue-600 h-2.5 rounded-full" 
               style={{ width: `${Math.round(outfit.confidence * 100)}%` }}
             ></div>
           </div>
           <p className="text-sm text-right mt-1">{Math.round(outfit.confidence * 100)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
