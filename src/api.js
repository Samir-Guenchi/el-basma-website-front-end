import axios from 'axios';

// API Base URL - Railway production server (hardcoded for reliability)
const API_BASE_URL = 'https://web-production-1c70.up.railway.app';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout (increased for slow connections)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry logic for failed requests
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Don't retry if no config or already retried 3 times
    if (!config || config.__retryCount >= 3) {
      console.error('API request failed after retries:', error.message);
      return Promise.reject(error);
    }
    
    // Only retry on network errors or 5xx server errors
    const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status < 600);
    if (!shouldRetry) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount++;
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, config.__retryCount - 1) * 1000;
    console.log(`Retrying request (${config.__retryCount}/3) after ${delay}ms:`, config.url);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }
);

// Helper function to convert relative image URLs to full URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.jpg';
  
  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Relative path - add base URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Helper function to parse images field (can be JSON array or single path)
export const parseImages = (imagesField) => {
  if (!imagesField) return [];
  
  // Already an array
  if (Array.isArray(imagesField)) return imagesField;
  
  // It's a string
  if (typeof imagesField === 'string') {
    // Try to parse as JSON array
    if (imagesField.startsWith('[')) {
      try {
        return JSON.parse(imagesField);
      } catch (e) {
        return [imagesField];
      }
    }
    // Single path string - wrap in array
    return [imagesField];
  }
  
  return [];
};

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
