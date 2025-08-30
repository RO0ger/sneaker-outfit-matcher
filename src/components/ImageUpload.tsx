'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/image-utils';
import { imageUploadVariants, buttonVariants } from '@/lib/animations';

interface ImageUploadProps {
  onAnalyze: (file: File) => Promise<void>;
  loading: boolean;
}

export function ImageUpload({ onAnalyze, loading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
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

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        variants={imageUploadVariants}
        initial="initial"
        animate={isDragOver ? "dragOver" : "animate"}
        onClick={triggerFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300/50 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300/70 transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {preview ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.p
              className="text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Click to select a different image
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-4xl"
              animate={{
                scale: isDragOver ? [1, 1.1, 1] : 1,
                rotate: isDragOver ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              👟
            </motion.div>
            <div>
              <motion.p
                className="text-lg font-medium"
                animate={{ scale: isDragOver ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDragOver ? "Drop your sneaker photo here!" : "Upload your sneaker photo"}
              </motion.p>
              <motion.p
                className="text-sm text-gray-300"
                animate={{ opacity: isDragOver ? 0.8 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDragOver ? "Release to analyze" : "Click to select or drag & drop"}
              </motion.p>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <AnimatePresence>
        {loading && (
          <motion.div
            className="mt-4 text-center text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center space-x-2">
              <motion.div
                className="rounded-full h-4 w-4 border-2 border-blue-400/30 border-t-blue-400"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analyzing your sneakers...
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
