'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { successVariants } from '@/lib/animations';

interface SuccessNotificationProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function SuccessNotification({ message, isVisible, onClose }: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-lg border border-green-400 text-white px-6 py-4 rounded-lg shadow-xl max-w-sm"
          variants={successVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          role="alert"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex-shrink-0"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              ✅
            </motion.div>
            <div className="flex-1">
              <motion.p
                className="font-medium"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
            </div>
            {onClose && (
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 ml-2 text-green-200 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>
          <motion.div
            className="mt-3 h-1 bg-green-400/50 rounded-full overflow-hidden"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
