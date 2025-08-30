'use client';

import { motion, PanInfo } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cardVariants, staggerItem, gestureVariants } from '@/lib/animations';

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
  onSwipe?: (direction: 'left' | 'right') => void;
}

export function OutfitCard({ outfit, index, onSwipe }: OutfitCardProps) {
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0) {
        onSwipe?.('right');
      } else {
        onSwipe?.('left');
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag="drag"
      style={{
        cursor: 'grab',
      }}
    >
      <Card className="bg-transparent border-0 shadow-none h-full">
        <CardHeader className="text-white">
          <motion.div
            className="flex justify-between items-start"
            variants={staggerItem}
          >
            <motion.div variants={staggerItem}>
              <CardTitle>Outfit {index + 1}</CardTitle>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Badge
                variant="outline"
                className="capitalize border-white/50 text-white"
              >
                {outfit.occasion}
              </Badge>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 text-white">
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h4
              className="font-semibold mb-2"
              variants={staggerItem}
            >
              Items:
            </motion.h4>
            <div className="flex flex-wrap gap-2">
              {outfit.items.map((item, itemIndex) => (
                <motion.span
                  key={itemIndex}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    item.owned
                      ? 'bg-green-500/20 text-green-200 border-green-400/50'
                      : 'bg-orange-500/20 text-orange-200 border-orange-400/50'
                  }`}
                  variants={staggerItem}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: itemIndex * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                >
                  {item.name}
                  <span className="ml-1.5 text-xs">
                    {item.owned ? '✓' : '🛒'}
                  </span>
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.h4
              className="font-semibold mb-2"
              variants={staggerItem}
            >
              AI Confidence:
            </motion.h4>
            <div className="w-full bg-gray-200/30 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-blue-400 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(outfit.confidence * 100)}%` }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  ease: "easeOut"
                }}
              ></motion.div>
            </div>
            <motion.p
              className="text-sm text-right mt-1 text-gray-300"
              variants={staggerItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(outfit.confidence * 100)}%
            </motion.p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
