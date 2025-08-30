import { Variants } from 'framer-motion';

// Core animation variants for consistency across the app
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};

export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const imageUploadVariants: Variants = {
  initial: {
    scale: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dragOver: {
    scale: 1.02,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    transition: {
      duration: 0.2,
    },
  },
  animate: {
    scale: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transition: {
      duration: 0.2,
    },
  },
};

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

export const loadingVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const skeletonVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const errorVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

export const successVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // Bounce effect
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
    },
  },
};

// Utility function for creating custom variants
export const createFadeInUp = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
});

export const createScaleIn = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
});

export const createSlideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'up', delay: number = 0): Variants => {
  const directionMap = {
    left: { x: -30 },
    right: { x: 30 },
    up: { y: -30 },
    down: { y: 30 },
  };

  return {
    initial: {
      opacity: 0,
      ...directionMap[direction],
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
};

// Gesture animations for drag/swipe interactions
export const gestureVariants: Variants = {
  drag: {
    scale: 1.05,
    rotate: 5,
    transition: {
      duration: 0.2,
    },
  },
  swipe: {
    scale: 0.95,
    rotate: -5,
    transition: {
      duration: 0.2,
    },
  },
  release: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
    },
  },
};

// Scroll-triggered animation variants
export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Performance optimized variants for frequent re-renders
export const optimizedVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

// Reduced motion variants for accessibility
export const reducedMotionVariants: Variants = {
  hover: {
    opacity: 0.8,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    opacity: 0.9,
    transition: {
      duration: 0.1,
    },
  },
};

// Utility function to detect reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Layout animation variants for smooth layout changes
export const layoutVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};
