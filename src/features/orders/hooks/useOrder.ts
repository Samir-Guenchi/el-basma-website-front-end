/**
 * useOrder Hook - Order Management
 * Single Responsibility: Only handles order creation and delivery lookup
 */

import { useState, useCallback } from 'react';
import { orderService } from '../services/OrderService';
import { 
  OrderFormData, 
  OrderItem, 
  CreateOrderRequest, 
  DeliveryInfo 
} from '../types/order.types';
import { Product } from '../../products/types/product.types';

interface UseOrderResult {
  // Form state
  formData: OrderFormData;
  items: OrderItem[];
  isSubmitting: boolean;
  orderSuccess: boolean;
  
  // Delivery state
  deliveryInfo: DeliveryInfo | null;
  deliveryLoading: boolean;
  deliveryError: string;
  
  // Actions
  updateFormField: (field: keyof OrderFormData, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof OrderItem, value: string) => void;
  checkDeliveryPrice: (city: string) => Promise<void>;
  submitOrder: (product: Product) => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: OrderFormData = {
  customerName: '',
  customerPhone: '',
  customerCity: '',
  customerAddress: '',
  notes: '',
};

export const useOrder = (
  defaultColor: string = '',
  defaultSize: string = ''
): UseOrderResult => {
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [items, setItems] = useState<OrderItem[]>([{ color: defaultColor, size: defaultSize }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');

  // Form field update
  const updateFormField = useCallback((field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Item management
  const addItem = useCallback(() => {
    setItems(prev => [...prev, { color: defaultColor, size: defaultSize }]);
  }, [defaultColor, defaultSize]);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  }, []);

  const updateItem = useCallback((index: number, field: keyof OrderItem, value: string) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  }, []);

  // Delivery price check
  const checkDeliveryPrice = useCallback(async (city: string) => {
    if (!city || city.length < 2) {
      setDeliveryInfo(null);
      setDeliveryError('');
      return;
    }

    setDeliveryLoading(true);
    setDeliveryError('');

    try {
      const results = await orderService.searchDelivery(city);
      if (results && results.length > 0) {
        setDeliveryInfo(results[0]);
        setDeliveryError('');
      } else {
        setDeliveryInfo(null);
        setDeliveryError('wilayaNotFound');
      }
    } catch {
      setDeliveryInfo(null);
      setDeliveryError('wilayaNotFound');
    } finally {
      setDeliveryLoading(false);
    }
  }, []);

  // Format items details for order notes
  const formatItemsDetails = useCallback((): string => {
    if (items.length === 1) {
      return items[0].color && items[0].size 
        ? `${items[0].color} - ${items[0].size}` 
        : items[0].color || items[0].size || '';
    }
    return items.map((item, i) => `${i + 1}. ${item.color || '-'} / ${item.size || '-'}`).join('\n');
  }, [items]);

  // Submit order
  const submitOrder = useCallback(async (product: Product): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const itemsDetails = formatItemsDetails();
      const orderNotes = items.length > 1 
        ? `Items Details:\n${itemsDetails}\n\n${formData.notes || ''}`
        : formData.notes;

      const orderRequest: CreateOrderRequest = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        city: formData.customerCity.trim(),
        address: formData.customerAddress.trim(),
        productId: product.id,
        productName: product.name,
        quantity: items.length,
        totalPrice: product.price * items.length,
        selectedColor: items.length === 1 ? items[0].color : itemsDetails,
        selectedSize: items.length === 1 ? items[0].size : '',
        notes: orderNotes,
        source: 'website',
        platform: 'website',
      };

      await orderService.createOrder(orderRequest);
      setOrderSuccess(true);
      return true;
    } catch (error) {
      console.error('Order error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, items, formatItemsDetails]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setItems([{ color: defaultColor, size: defaultSize }]);
    setOrderSuccess(false);
    setDeliveryInfo(null);
    setDeliveryError('');
  }, [defaultColor, defaultSize]);

  return {
    formData,
    items,
    isSubmitting,
    orderSuccess,
    deliveryInfo,
    deliveryLoading,
    deliveryError,
    updateFormField,
    addItem,
    removeItem,
    updateItem,
    checkDeliveryPrice,
    submitOrder,
    resetForm,
  };
};

export default useOrder;
