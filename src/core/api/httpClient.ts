/**
 * HTTP Client - Core API Infrastructure
 * Single Responsibility: Only handles HTTP communication
 * Open/Closed: Can be extended with new interceptors without modification
 * Dependency Inversion: Depends on abstractions (IHttpClient interface)
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/app.config';

// Interface for HTTP Client (Dependency Inversion)
export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Retry interceptor configuration
interface RetryConfig extends AxiosRequestConfig {
  __retryCount?: number;
}

class HttpClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_CONFIG.baseUrl) {
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor with retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as RetryConfig;

        // Don't retry if no config or already retried max times
        if (!config || (config.__retryCount ?? 0) >= API_CONFIG.retryAttempts) {
          console.error('API request failed after retries:', error.message);
          return Promise.reject(error);
        }

        // Only retry on network errors or 5xx server errors
        const shouldRetry = !error.response || 
          (error.response.status >= 500 && error.response.status < 600);
        
        if (!shouldRetry) {
          return Promise.reject(error);
        }

        config.__retryCount = (config.__retryCount ?? 0) + 1;

        // Exponential backoff
        const delay = Math.pow(2, config.__retryCount - 1) * API_CONFIG.retryDelay;
        console.log(`Retrying request (${config.__retryCount}/${API_CONFIG.retryAttempts}) after ${delay}ms:`, config.url);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.client(config);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

// Singleton instance
export const httpClient = new HttpClient();

export default HttpClient;
