import axios from 'axios';

// API Base URL - Railway production server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-1c70.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
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
