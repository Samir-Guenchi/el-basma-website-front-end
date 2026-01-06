/**
 * Performance Optimization Utilities
 * Prevents forced reflows by batching DOM reads/writes
 */

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
 * Intersection Observer hook for lazy loading
 * More performant than scroll listeners
 */
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
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
  }, [ref, options]);

  return isIntersecting;
};

/**
 * Debounced resize handler to prevent excessive reflows
 */
export const useDebounceResize = (callback, delay = 150) => {
  React.useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(callback);
      }, delay);
    };

    window.addEventListener('resize', handleResize);
    
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
  React.useEffect(() => {
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
  useIntersectionObserver,
  useDebounceResize,
  useOptimizedScroll,
};
