/**
 * Order Service - Business Logic Layer
 * Single Responsibility: Only handles order business logic
 * Dependency Inversion: Depends on IHttpClient abstraction
 */

import { httpClient, IHttpClient } from '../../../core/api/httpClient';
import { CreateOrderRequest, Order, DeliveryInfo } from '../types/order.types';

// Interface for Order Service (Interface Segregation)
export interface IOrderService {
  createOrder(orderData: CreateOrderRequest): Promise<Order>;
  searchDelivery(city: string): Promise<DeliveryInfo[]>;
  getDeliveryPrices(): Promise<DeliveryInfo[]>;
}

class OrderService implements IOrderService {
  constructor(private client: IHttpClient = httpClient) {}

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return this.client.post<Order>('/api/orders', {
      ...orderData,
      source: 'website',
      platform: 'website',
    });
  }

  async searchDelivery(city: string): Promise<DeliveryInfo[]> {
    return this.client.get<DeliveryInfo[]>(
      `/api/delivery/search?city=${encodeURIComponent(city)}`
    );
  }

  async getDeliveryPrices(): Promise<DeliveryInfo[]> {
    return this.client.get<DeliveryInfo[]>('/api/delivery');
  }

  async getDeliveryPriceForCity(city: string): Promise<DeliveryInfo> {
    return this.client.get<DeliveryInfo>(
      `/api/delivery/city/${encodeURIComponent(city)}`
    );
  }
}

// Singleton instance
export const orderService = new OrderService();

export default OrderService;
