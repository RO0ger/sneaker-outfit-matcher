'use client';
import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { WardrobeManager } from '@/components/WardrobeManager';
import { Button } from '@/components/ui/button'; // Assuming this exists from shadcn
import { OutfitCard } from '@/components/OutfitCard';

// This interface is updated to include outfit suggestions
interface AnalysisResult {
  sneaker: {
    brand: string;
    model: string;
    colors: string[];
    style: string;
    confidence: number;
  };
  imageUrl: string;
  outfits: Array<{
    items: Array<{
      name: string;
      owned: boolean;
    }>;
    confidence: number;
  }>;
}

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWardrobe, setShowWardrobe] = useState(false);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setAnalysis(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'); // Using a hardcoded test user ID for local testing
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();

      if (!response.ok) {
        // Use the 'details' from the API response if available, otherwise a generic message
        throw new Error(result.details || 'An unknown error occurred during analysis.');
      }
      
      setAnalysis(result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Analysis failed:', errorMessage);
      setError(`Analysis failed: ${errorMessage} Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sneaker Outfit Matcher
          </h1>
          <p className="text-gray-600">
            Upload your sneakers, get personalized outfit suggestions
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ImageUpload onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Outfit Suggestions */}
              {analysis.outfits && analysis.outfits.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Outfit Suggestions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.outfits.map((outfit, index) => (
                      <OutfitCard key={index} outfit={outfit} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar for Sneaker Analysis */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-2xl font-bold mb-4">
                  Analysis Results
                </h2>
                <div className="space-y-4">
                  <img 
                    src={analysis.imageUrl} 
                    alt={`${analysis.sneaker.brand} ${analysis.sneaker.model}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-semibold">{analysis.sneaker.brand} {analysis.sneaker.model}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500 block">Colors</span>
                      <p>{analysis.sneaker.colors.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 block">Style</span>
                      <p className="capitalize">{analysis.sneaker.style}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 block">Confidence</span>
                      <p>{Math.round(analysis.sneaker.confidence * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wardrobe Management Button */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => setShowWardrobe(!showWardrobe)}
            variant="outline"
          >
            {showWardrobe ? 'Hide' : 'Manage'} Wardrobe
          </Button>
        </div>

        {showWardrobe && (
          <div className="mt-6">
            <WardrobeManager userId="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" />
          </div>
        )}
      </div>
    </div>
  );
}
