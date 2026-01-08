/**
 * Orders Feature - Public API
 * This file exports all public interfaces for the orders feature
 */

// Types
export * from './types/order.types';

// Services
export { orderService } from './services/OrderService';
export type { IOrderService } from './services/OrderService';

// Hooks
export { useOrder } from './hooks/useOrder';
