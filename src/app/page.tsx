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
    items: string[];
    reasoning: string;
    occasion: string;
    confidence: number;
  }>;
  trends: Array<{
    imageUrl: string;
    title: string;
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
      formData.append('userId', 'temp-user-id'); // Using a temporary user ID as per plan
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || 'Analysis failed');
      }
      
      setAnalysis(result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Analysis failed:', errorMessage);
      setError(`Failed to analyze image. Please try again. (Error: ${errorMessage})`);
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

        {analysis && (
          <div className="space-y-6">
            {/* Sneaker Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">
                Analysis Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img 
                    src={analysis.imageUrl} 
                    alt={`${analysis.sneaker.brand} ${analysis.sneaker.model}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
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

            {/* Outfit Suggestions */}
            {analysis.outfits && analysis.outfits.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Outfit Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.outfits.map((outfit, index) => (
                    <OutfitCard key={index} outfit={outfit} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Trend Inspiration */}
            {analysis.trends && analysis.trends.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Trend Inspiration</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analysis.trends.map((trend, index) => (
                    <div key={index} className="group relative">
                      <img 
                        src={trend.imageUrl} 
                        alt={trend.title}
                        className="w-full h-48 object-cover rounded-lg mb-2 group-hover:opacity-75 transition-opacity"
                      />
                      <p className="text-sm text-gray-600 truncate">{trend.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <WardrobeManager userId="temp-user-id" />
          </div>
        )}
      </div>
    </div>
  );
}
