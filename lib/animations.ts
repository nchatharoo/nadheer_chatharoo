import { Variants } from 'framer-motion';

export const fadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      delay
    }
  }
});

export const slideUp = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const slideDown = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const slideInLeft = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const slideInRight = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const staggerContainer = (staggerChildren: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren
    }
  }
});

export const scaleUp = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const rotateIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, rotate: -5 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { 
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};