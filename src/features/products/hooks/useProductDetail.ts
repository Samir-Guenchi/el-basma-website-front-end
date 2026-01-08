/**
 * useProductDetail Hook - Single Product Data
 * Single Responsibility: Only handles single product fetching and state
 */

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/ProductService';
import { Product } from '../types/product.types';
import { parseJsonField } from '../utils/productHelpers';
import { LoadingState } from '../../../shared/types/common.types';

interface ProductSelection {
  color: string;
  size: string;
  quantity: number;
}

interface UseProductDetailResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  loadingState: LoadingState;
  selection: ProductSelection;
  colors: string[];
  sizes: string[];
  inventory: Record<string, number>;
  setSelectedColor: (color: string) => void;
  setSelectedSize: (size: string) => void;
  setQuantity: (quantity: number) => void;
  getColorStock: (color: string) => number | null;
  getVariantStock: (color: string, size: string) => number | null;
  maxQuantity: number;
  refetch: () => Promise<void>;
}

export const useProductDetail = (productId: string): UseProductDetailResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<ProductSelection>({
    color: '',
    size: '',
    quantity: 1,
  });

  // Parse product data
  const colors = parseJsonField<string[]>(product?.colors, []);
  const sizes = parseJsonField<string[]>(product?.sizes, []);
  const inventory = parseJsonField<Record<string, number>>(product?.inventory, {});

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoadingState('loading');
    setError(null);

    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
      setLoadingState('success');

      // Initialize selection with first available options
      const productColors = parseJsonField<string[]>(data.colors, []);
      const productSizes = parseJsonField<string[]>(data.sizes, []);

      setSelection({
        color: productColors[0] || '',
        size: productSizes[0] || '',
        quantity: 1,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
      setError(errorMessage);
      setLoadingState('error');
      console.error('Error fetching product:', err);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Get stock for a specific color
  const getColorStock = useCallback((color: string): number | null => {
    if (!inventory || Object.keys(inventory).length === 0) return null;
    
    let total = 0;
    Object.keys(inventory).forEach(key => {
      if (key.startsWith(color + '/') || key.startsWith(color + '-')) {
        total += inventory[key] || 0;
      }
    });
    
    return total > 0 ? total : null;
  }, [inventory]);

  // Get stock for a specific color + size combination
  const getVariantStock = useCallback((color: string, size: string): number | null => {
    if (!inventory || Object.keys(inventory).length === 0) return null;
    
    const key = `${color}/${size}`;
    const altKey = `${color}-${size}`;
    
    return inventory[key] ?? inventory[altKey] ?? null;
  }, [inventory]);

  // Calculate max quantity
  const currentVariantStock = selection.color && selection.size 
    ? getVariantStock(selection.color, selection.size) 
    : null;
  
  const currentColorStock = selection.color 
    ? getColorStock(selection.color) 
    : null;

  const maxQuantity = currentVariantStock !== null 
    ? currentVariantStock 
    : (currentColorStock !== null ? currentColorStock : (product?.quantity || 1));

  // Selection setters
  const setSelectedColor = useCallback((color: string) => {
    setSelection(prev => ({ ...prev, color, quantity: 1 }));
  }, []);

  const setSelectedSize = useCallback((size: string) => {
    setSelection(prev => ({ ...prev, size, quantity: 1 }));
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setSelection(prev => ({ 
      ...prev, 
      quantity: Math.max(1, Math.min(quantity, maxQuantity)) 
    }));
  }, [maxQuantity]);

  return {
    product,
    loading: loadingState === 'loading',
    error,
    loadingState,
    selection,
    colors,
    sizes,
    inventory,
    setSelectedColor,
    setSelectedSize,
    setQuantity,
    getColorStock,
    getVariantStock,
    maxQuantity,
    refetch: fetchProduct,
  };
};

export default useProductDetail;
