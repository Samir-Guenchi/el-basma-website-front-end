/**
 * Common Types - Shared across the application
 * Single Responsibility: Only type definitions
 */

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Translation text
export interface TranslatedText {
  ar: string;
  dz: string;
  fr: string;
  en: string;
}

// Base entity
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
