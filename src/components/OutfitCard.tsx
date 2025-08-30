import { CheckCircle, Sparkles, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OutfitItem {
  name: string;
  color: string;
  type: string;
}

interface OutfitSuggestion {
  id: string;
  items: OutfitItem[];
  confidence: number;
}

interface OutfitCardProps {
  sneakerImage: string;
  sneakerName: string;
  sneakerColors: string[];
  sneakerStyle: string;
  suggestions: OutfitSuggestion[];
  onBack: () => void;
  onManageWardrobe: () => void;
}

export const OutfitCard = ({
  sneakerImage,
  sneakerName,
  sneakerColors,
  sneakerStyle,
  suggestions,
  onBack,
  onManageWardrobe
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
  return <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Outfit Suggestions
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered styling recommendations for your sneakers
        </p>
      </div>

      {/* Sneaker Analysis Card */}
      <Card className="glass-card p-8 rounded-2xl animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <img src={sneakerImage} alt="Analyzed sneaker" className="w-full max-w-md mx-auto rounded-xl shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm text-white/80">Click to select a different image</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
              <div className="relative p-6 glass-card rounded-xl">
                <h3 className="text-xl font-semibold mb-3">{sneakerName}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Colors</span>
                    <div className="flex gap-2">
                      {sneakerColors.map((color, index) => <Badge key={index} variant="secondary" className="glass-card">
                          {color}
                        </Badge>)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Style</span>
                    <Badge variant="outline" className="neon-border">
                      {sneakerStyle}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="text-success font-semibold">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Outfit Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suggestions.map((outfit, index) => <Card key={outfit.id} className="glass-card glass-card-hover p-6 rounded-2xl transition-all duration-300" style={{
        animationDelay: `${index * 150}ms`
      }}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Outfit {index + 1}</h3>
                <Sparkles className="w-5 h-5 text-accent" />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Items:</p>
                {outfit.items.map((item, itemIndex) => <div key={itemIndex} className="flex items-center space-x-3 p-3 glass-card rounded-lg">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="capitalize font-medium">{item.name}</span>
                  </div>)}
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
          </Card>)}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button variant="outline" size="lg" onClick={onBack} className="glass-card neon-border hover:glow-primary transition-all duration-300 text-lg px-8 py-6">
          <RotateCcw className="w-5 h-5 mr-2" />
          Try Another Photo
        </Button>
        
        <Button variant="outline" size="lg" onClick={onManageWardrobe} className="glass-card neon-border hover:glow-secondary transition-all duration-300 text-lg px-8 py-6">
          <Sparkles className="w-5 h-5 mr-2" />
          Manage Wardrobe
        </Button>
      </div>
    </div>;
};