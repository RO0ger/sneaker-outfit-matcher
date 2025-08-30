"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { WardrobeManager } from "@/components/WardrobeManager";
import { OutfitCard } from "@/components/OutfitCard";

type ViewState = 'upload' | 'wardrobe' | 'results';

export default function Page() {
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
          <OutfitCard
            sneakerImage={uploadedImage}
            sneakerName="Nike Air Jordan 1 Low"
            sneakerColors={['black', 'grey', 'white']}
            sneakerStyle="Streetwear"
            suggestions={mockSuggestions}
            onBack={handleBackToUpload}
            onManageWardrobe={handleManageWardrobe}
          />
        )}

        {currentView === 'wardrobe' && (
          <WardrobeManager onClose={handleCloseWardrobe} />
        )}
      </div>
    </main>
  );
}
