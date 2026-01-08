/**
 * Product Service - Business Logic Layer
 * Single Responsibility: Only handles product business logic
 * Dependency Inversion: Depends on IHttpClient abstraction
 * Open/Closed: Can be extended without modification
 */

import { httpClient, IHttpClient } from '../../../core/api/httpClient';
import { Product, ProductFilter } from '../types/product.types';

// Interface for Product Service (Interface Segregation)
export interface IProductService {
  getProducts(filter?: ProductFilter): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

class ProductService implements IProductService {
  constructor(private client: IHttpClient = httpClient) {}

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.publishedOnWebsite !== false) {
        params.append('publishedOnWebsite', 'true');
      }
      
      const queryString = params.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching products from:', url);
      const products = await this.client.get<Product[]>(url);
      console.log('Products fetched successfully:', products?.length || 0, 'items');
      
      return this.applyFilters(products, filter);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    return this.client.get<Product>(`/api/products/${id}`);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getProducts();
    
    if (category === 'all') return products;
    
    return products.filter(p => 
      p.category?.toLowerCase().includes(category.toLowerCase())
    );
  }

  private applyFilters(products: Product[], filter?: ProductFilter): Product[] {
    if (!filter) return products;

    return products.filter(product => {
      // Category filter
      if (filter.category && filter.category !== 'all') {
        if (!product.category?.toLowerCase().includes(filter.category.toLowerCase())) {
          return false;
        }
      }

      // In stock filter
      if (filter.inStock !== undefined && product.inStock !== filter.inStock) {
        return false;
      }

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(searchLower);
        const matchesCategory = product.category?.toLowerCase().includes(searchLower);
        const matchesDescription = product.description?.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesCategory && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }
}

// Singleton instance
export const productService = new ProductService();

export default ProductService;
