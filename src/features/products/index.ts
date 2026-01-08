/**
 * Products Feature - Public API
 * This file exports all public interfaces for the products feature
 */

// Types
export * from './types/product.types';

// Services
export { productService } from './services/ProductService';
export type { IProductService } from './services/ProductService';

// Hooks
export { useProducts } from './hooks/useProducts';
export { useProductDetail } from './hooks/useProductDetail';

// Utils
export {
  parseImages,
  parseJsonField,
  getImageUrl,
  getOptimizedImageUrl,
  getThumbnailUrl,
  formatPrice,
  getColorHex,
} from './utils/productHelpers';
