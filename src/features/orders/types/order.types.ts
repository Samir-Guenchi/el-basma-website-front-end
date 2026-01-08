/**
 * Order Types - Feature-specific types
 * Single Responsibility: Only order-related type definitions
 */

import { BaseEntity } from '../../../shared/types/common.types';

export interface OrderItem {
  color: string;
  size: string;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  selectedColor?: string;
  selectedSize?: string;
  notes?: string;
  source: 'website';
  platform: 'website';
}

export interface Order extends BaseEntity {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface DeliveryInfo {
  city: string;
  home: number;
  office: number;
}
