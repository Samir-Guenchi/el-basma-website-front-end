/**
 * Product Types - Feature-specific types
 * Single Responsibility: Only product-related type definitions
 */

import { BaseEntity } from '../../../shared/types/common.types';

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  price: number;
  priceWholesale?: number;
  images: string | string[];
  videos?: string | string[];
  colors?: string | string[];
  sizes?: string | string[];
  quantity: number;
  inStock: boolean;
  publishedOnWebsite: boolean;
  inventory?: string | Record<string, number>;
}

export interface ProductFilter {
  category?: string;
  inStock?: boolean;
  publishedOnWebsite?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt';
  order: 'asc' | 'desc';
}

// Category definition
export interface Category {
  id: string;
  icon: string;
  translationKey: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', icon: '✨', translationKey: 'allProducts' },
  { id: 'djellaba', icon: '👗', translationKey: 'djellaba' },
  { id: 'caftan', icon: '👘', translationKey: 'caftan' },
  { id: 'abaya', icon: '🧕', translationKey: 'abaya' },
  { id: 'takchita', icon: '💃', translationKey: 'takchita' },
  { id: 'ensemble', icon: '👔', translationKey: 'ensemble' },
  { id: 'other', icon: '🎁', translationKey: 'other' },
];
