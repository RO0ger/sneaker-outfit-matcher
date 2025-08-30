'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from '@/components/ImageUpload';
import { WardrobeManager } from '@/components/WardrobeManager';
import { Button } from '@/components/ui/button'; // Assuming this exists from shadcn
import { OutfitCard } from '@/components/OutfitCard';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { pageVariants, staggerContainer, staggerItem, skeletonVariants, buttonVariants, optimizedVariants, layoutVariants } from '@/lib/animations';
import { ScrollReveal } from '@/components/ScrollReveal';

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
    occasion: string;
    confidence: number;
  }>;
}

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
      >
        <div className="max-w-4xl mx-auto py-8 px-4">
          <motion.header
            className="text-center mb-8"
            variants={staggerItem}
          >
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              variants={staggerItem}
            >
              Sneaker Outfit Matcher
            </motion.h1>
            <motion.p
              className="text-gray-300"
              variants={staggerItem}
            >
              Upload your sneakers, get personalized outfit suggestions
            </motion.p>
          </motion.header>

        <ScrollReveal threshold={0.3}>
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 mb-6 border border-white/20"
            variants={staggerItem}
          >
            <ImageUpload onAnalyze={handleAnalyze} loading={loading} />
          </motion.div>
        </ScrollReveal>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500/30 backdrop-blur-lg border border-red-400 text-white px-4 py-3 rounded-lg relative mb-6"
              role="alert"
              variants={staggerItem}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/20"
                  variants={staggerItem}
                >
                  <motion.div
                    className="h-6 bg-gray-400/30 rounded w-1/3 mb-4"
                    variants={skeletonVariants}
                    animate="animate"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                  ></motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <motion.div
                        className="w-full h-40 bg-gray-400/30 rounded-lg"
                        variants={skeletonVariants}
                        animate="animate"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                          backgroundSize: '200% 100%',
                        }}
                      ></motion.div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <motion.div
                        className="h-5 bg-gray-400/30 rounded w-3/4"
                        variants={skeletonVariants}
                        animate="animate"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                          backgroundSize: '200% 100%',
                        }}
                      ></motion.div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="h-4 bg-gray-400/30 rounded w-full"
                          variants={skeletonVariants}
                          animate="animate"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                            backgroundSize: '200% 100%',
                          }}
                        ></motion.div>
                        <motion.div
                          className="h-4 bg-gray-400/30 rounded w-full"
                          variants={skeletonVariants}
                          animate="animate"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                            backgroundSize: '200% 100%',
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {analysis && (
            <ScrollReveal threshold={0.2} delay={0.1}>
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                exit="exit"
              >
              {/* Main content */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                variants={staggerItem}
              >
                {/* Outfit Suggestions */}
                {analysis.outfits && analysis.outfits.length > 0 && (
                  <motion.div
                    className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/20"
                    variants={staggerItem}
                  >
                    <motion.h2
                      className="text-2xl font-bold mb-4 text-white"
                      variants={staggerItem}
                    >
                      Outfit Suggestions
                    </motion.h2>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      variants={staggerContainer}
                    >
                      {analysis.outfits.map((outfit, index) => (
                        <motion.div
                          key={index}
                          variants={staggerItem}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <OutfitCard outfit={outfit} index={index} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Sidebar for Sneaker Analysis */}
              <motion.div
                className="lg:col-span-1 space-y-6"
                variants={staggerItem}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 sticky top-8 border border-white/20"
                  variants={staggerItem}
                >
                  <motion.h2
                    className="text-2xl font-bold mb-4 text-white"
                    variants={staggerItem}
                  >
                    Analysis Results
                  </motion.h2>
                  <div className="space-y-4 text-white">
                    <motion.img
                      src={analysis.imageUrl}
                      alt={`${analysis.sneaker.brand} ${analysis.sneaker.model}`}
                      className="w-full h-auto object-cover rounded-lg"
                      variants={staggerItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                    <motion.h3
                      className="text-xl font-semibold"
                      variants={staggerItem}
                    >
                      {analysis.sneaker.brand} {analysis.sneaker.model}
                    </motion.h3>
                    <motion.div
                      className="grid grid-cols-2 gap-4 text-sm"
                      variants={staggerItem}
                    >
                      <div>
                        <span className="font-medium text-gray-300 block">Colors</span>
                        <p>{analysis.sneaker.colors.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300 block">Style</span>
                        <p className="capitalize">{analysis.sneaker.style}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300 block">Confidence</span>
                        <p>{Math.round(analysis.sneaker.confidence * 100)}%</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            </ScrollReveal>
          )}
        </AnimatePresence>

        {/* Wardrobe Management Button */}
        <motion.div
          className="text-center mt-8"
          variants={staggerItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={optimizedVariants}
                whileHover="hover"
                whileTap="tap"
                initial="initial"
              >
                <Button variant="outline">
                  Manage Wardrobe
                </Button>
              </motion.div>
            </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>My Wardrobe</DrawerTitle>
              <DrawerDescription>Manage your clothing items here.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <WardrobeManager 
                userId="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" 
                initialLimit={3}
                isInDrawer={true}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        </motion.div>
      </div>
    </motion.div>
    </AnimatePresence>
  );
}
