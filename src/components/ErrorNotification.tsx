'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { errorVariants } from '@/lib/animations';

interface ErrorNotificationProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function ErrorNotification({ message, isVisible, onClose }: ErrorNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-red-500/90 backdrop-blur-lg border border-red-400 text-white px-6 py-4 rounded-lg shadow-xl max-w-sm"
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          role="alert"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex-shrink-0"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: 2,
                ease: "easeInOut"
              }}
            >
              ⚠️
            </motion.div>
            <div className="flex-1">
              <motion.p
                className="font-medium"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {message}
              </motion.p>
            </div>
            {onClose && (
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 ml-2 text-red-200 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </div>
          <motion.div
            className="mt-3 h-1 bg-red-400/50 rounded-full overflow-hidden"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
