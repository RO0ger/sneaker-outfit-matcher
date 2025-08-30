'use client';
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { WardrobeManager } from "@/components/WardrobeManager";
import { OutfitCard, OutfitSuggestion } from "@/components/OutfitCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Sparkles, RotateCcw } from 'lucide-react';

type ViewState = 'upload' | 'wardrobe' | 'results';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Mock data for demonstration
  const mockSuggestions = [
    {
      id: '1',
      items: [
        { name: 'Black Nike Hoodie', color: 'Black', type: 'top' },
        { name: 'Grey shorts', color: 'Grey', type: 'bottom' }
      ],
      confidence: 85
    },
    {
      id: '2',
      items: [
        { name: 'Black Nike Pants', color: 'Black', type: 'bottom' },
        { name: 'white full sleeve shirt', color: 'White', type: 'top' }
      ],
      confidence: 80
    },
    {
      id: '3',
      items: [
        { name: 'black diesel tee', color: 'Black', type: 'top' },
        { name: 'Black Nike Pants', color: 'Black', type: 'bottom' }
      ],
      confidence: 75
    }
  ];

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      // Simulate processing and show results
      setTimeout(() => {
        setCurrentView('results');
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleManageWardrobe = () => {
    setCurrentView('wardrobe');
  };

  const handleCloseWardrobe = () => {
    setCurrentView(uploadedImage ? 'results' : 'upload');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setUploadedImage(null);
  };

  return (
    <main className="min-h-screen space-gradient">
      <div className="container mx-auto px-4 py-12">
        {currentView === 'upload' && (
          <ImageUpload 
            onImageUpload={handleImageUpload}
            onManageWardrobe={handleManageWardrobe}
          />
        )}

        {currentView === 'results' && uploadedImage && (
          <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Outfit Suggestions
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-powered styling recommendations for your sneakers
              </p>
            </div>

            <Card className="glass-card p-8 rounded-2xl animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <img src={uploadedImage} alt="Analyzed sneaker" className="w-full max-w-md mx-auto rounded-xl shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
                    <div className="relative p-6 glass-card rounded-xl">
                      <h3 className="text-xl font-semibold mb-3">Nike Air Jordan 1 Low</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Colors</span>
                          <div className="flex gap-2">
                            {['black', 'grey', 'white'].map((color, index) => (
                              <Badge key={index} variant="secondary" className="glass-card">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Style</span>
                          <Badge variant="outline" className="neon-border">
                            Streetwear
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockSuggestions.map((outfit, index) => (
                <OutfitCard key={outfit.id} outfit={outfit} index={index} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button variant="outline" size="lg" onClick={handleBackToUpload} className="glass-card neon-border hover:glow-primary transition-all duration-300 text-lg px-8 py-6">
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Another Photo
              </Button>
              
              <Button variant="outline" size="lg" onClick={handleManageWardrobe} className="glass-card neon-border hover:glow-secondary transition-all duration-300 text-lg px-8 py-6">
                <Sparkles className="w-5 h-5 mr-2" />
                Manage Wardrobe
              </Button>
            </div>
          </div>
        )}

        {currentView === 'wardrobe' && (
          <WardrobeManager onClose={handleCloseWardrobe} />
        )}
      </div>
    </main>
  );
};

export default Index;
