/**
 * useProducts Hook - Product Data Fetching
 * Single Responsibility: Only handles product data fetching and state
 */

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/ProductService';
import { Product, ProductFilter } from '../types/product.types';
import { LoadingState } from '../../../shared/types/common.types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadingState: LoadingState;
  refetch: () => Promise<void>;
  filterProducts: (filter: ProductFilter) => Product[];
}

export const useProducts = (initialFilter?: ProductFilter): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoadingState('loading');
    setError(null);

    try {
      const data = await productService.getProducts(initialFilter);
      setProducts(data || []);
      setLoadingState('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      setLoadingState('error');
      console.error('Error fetching products:', err);
    }
  }, [initialFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterProducts = useCallback((filter: ProductFilter): Product[] => {
    return products.filter(product => {
      // Must be in stock and published
      if (!product.inStock || product.quantity <= 0 || !product.publishedOnWebsite) {
        return false;
      }

      // Category filter
      if (filter.category && filter.category !== 'all') {
        if (!product.category?.toLowerCase().includes(filter.category.toLowerCase())) {
          return false;
        }
      }

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(searchLower);
        const matchesCategory = product.category?.toLowerCase().includes(searchLower);
        const matchesDescription = product.description?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesCategory && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [products]);

  return {
    products,
    loading: loadingState === 'loading',
    error,
    loadingState,
    refetch: fetchProducts,
    filterProducts,
  };
};

export default useProducts;
