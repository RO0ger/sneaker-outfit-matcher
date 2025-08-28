'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/image-utils';

interface ImageUploadProps {
  onAnalyze: (file: File) => Promise<void>;
  loading: boolean;
}

export function ImageUpload({ onAnalyze, loading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB');
      return;
    }

    // Compress if large
    const finalFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
    
    // Show preview
    const previewUrl = URL.createObjectURL(finalFile);
    setPreview(previewUrl);

    // Analyze
    await onAnalyze(finalFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div 
        onClick={triggerFileSelect}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
            <p className="text-sm text-gray-600">Click to select a different image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">👟</div>
            <div>
              <p className="text-lg font-medium">Upload your sneaker photo</p>
              <p className="text-sm text-gray-600">Click to select or drag & drop</p>
            </div>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Analyzing your sneakers...</span>
          </div>
        </div>
      )}
    </div>
  );
}
