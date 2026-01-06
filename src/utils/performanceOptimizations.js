/**
 * Performance Optimization Utilities
 * Prevents forced reflows by batching DOM reads/writes
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Batch DOM measurements to prevent forced reflows
 * Use this when you need to measure multiple elements
 */
export const batchMeasure = (callback) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const result = callback();
      resolve(result);
    });
  });
};

/**
 * Batch DOM writes to prevent layout thrashing
 * Use this when you need to update multiple elements
 */
export const batchWrite = (callback) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const result = callback();
      resolve(result);
    });
  });
};

/**
 * Optimized dimension getter that batches reads
 * Usage: const { width, height } = await getDimensions(element)
 */
export const getDimensions = async (element) => {
  if (!element) return { width: 0, height: 0 };
  
  return batchMeasure(() => ({
    width: element.offsetWidth,
    height: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
  }));
};

/**
 * Hook to measure element dimensions without causing reflows
 * Batches all measurements in a single frame
 */
export const useMeasure = () => {
  const ref = useRef(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0, top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setBounds({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
          });
        }
      });
    };

    measure();

    // Debounced resize observer
    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, bounds];
};

/**
 * Intersection Observer hook for lazy loading
 * More performant than scroll listeners
 */
export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isIntersecting];
};

/**
 * Debounced resize handler to prevent excessive reflows
 */
export const useDebounceResize = (callback, delay = 150) => {
  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(callback);
      }, delay);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [callback, delay]);
};

/**
 * Optimized scroll handler using passive listeners
 */
export const useOptimizedScroll = (callback, options = {}) => {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, ...options });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, options]);
};

export default {
  batchMeasure,
  batchWrite,
  getDimensions,
  useMeasure,
  useIntersectionObserver,
  useDebounceResize,
  useOptimizedScroll,
};
