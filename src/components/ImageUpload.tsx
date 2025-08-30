import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Zap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import sneakerHero from '@/assets/sneaker-hero.png';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onManageWardrobe: () => void;
}

export const ImageUpload = ({
  onImageUpload,
  onManageWardrobe
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image src={sneakerHero} alt="Sneaker" className="w-20 h-20 animate-float" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse"></div>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Sneaker Outfit Matcher
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your sneakers and get AI-powered personalized outfit suggestions that match your style
        </p>
      </div>

      {/* Upload Card */}
      <Card className="glass-card glass-card-hover transition-all duration-300 p-8 rounded-2xl">
        <div className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-primary bg-primary/5 neon-border' : 'border-muted hover:border-primary/50'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={handleClick}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
          
          {previewImage ? <div className="space-y-4">
              <div className="relative inline-block">
                <Image src={previewImage} alt="Uploaded sneaker" width={320} height={192} className="max-w-xs max-h-48 rounded-lg shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
              <p className="text-muted-foreground">Click to select a different image</p>
            </div> : <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-glow-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Upload your sneaker photo</h3>
                <p className="text-muted-foreground">Click to select or drag & drop</p>
              </div>
            </div>}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onManageWardrobe} className="glass-card neon-border hover:glow-primary transition-all duration-300 text-lg px-8 py-6">
          <Zap className="w-5 h-5 mr-2" />
          Manage Wardrobe
        </Button>
        
        
      </div>
    </div>;
};