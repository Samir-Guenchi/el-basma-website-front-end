/**
 * API Module - Backward Compatible Exports
 * 
 * This file maintains backward compatibility with existing components
 * while the codebase is being migrated to the new modular structure.
 * 
 * New code should import from:
 * - '@/features/products' for product-related functions
 * - '@/features/orders' for order-related functions
 * - '@/core/api/httpClient' for HTTP client
 */

import axios from 'axios';

// Re-export from new modular structure for backward compatibility
export { 
  getImageUrl, 
  parseImages,
  getOptimizedImageUrl,
  formatPrice,
  getColorHex,
} from './features/products/utils/productHelpers';

// API Base URL - Railway production server
const API_BASE_URL = 'https://web-production-1c70.up.railway.app';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry logic for failed requests
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    if (!config || config.__retryCount >= 3) {
      console.error('API request failed after retries:', error.message);
      return Promise.reject(error);
    }
    
    const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);
    if (!shouldRetry) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount++;
    
    const delay = Math.pow(2, config.__retryCount - 1) * 1000;
    console.log(`Retrying request (${config.__retryCount}/3) after ${delay}ms:`, config.url);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }
);

// Products API - Only fetch products published on website
export const getProducts = async () => {
  try {
    console.log('Fetching products from:', API_BASE_URL + '/api/products?publishedOnWebsite=true');
    const response = await api.get('/api/products?publishedOnWebsite=true');
    console.log('Products fetched successfully:', response.data?.length || 0, 'items');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.error('Error details:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get('/api/products');
  const products = response.data;
  
  if (category === 'all') return products;
  
  return products.filter(p => 
    p.category?.toLowerCase().includes(category.toLowerCase())
  );
};

// Categories API
export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

// Orders API - Create order from website
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', {
    ...orderData,
    source: 'website', // Flag to identify website orders
    platform: 'website',
  });
  return response.data;
};

// Delivery prices
export const getDeliveryPrices = async () => {
  const response = await api.get('/api/delivery');
  return response.data;
};

// Get delivery price for specific city/wilaya
export const getDeliveryPriceForCity = async (city) => {
  const response = await api.get(`/api/delivery/city/${encodeURIComponent(city)}`);
  return response.data;
};

// Search delivery by city
export const searchDelivery = async (city) => {
  const response = await api.get(`/api/delivery/search?city=${encodeURIComponent(city)}`);
  return response.data;
};

// Settings API
export const getSettings = async () => {
  const response = await api.get('/api/settings');
  return response.data;
};

export default api;
