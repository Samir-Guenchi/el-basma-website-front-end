/**
 * Security Utilities
 * 
 * Implements security best practices for the frontend application.
 * Includes XSS prevention, CSRF protection helpers, and rate limiting.
 */

/**
 * Content Security Policy nonce generator
 * Used for inline scripts if needed
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return text.replace(/[&<>"'`=/]/g, char => htmlEntities[char] || char);
};

/**
 * Validate URL to prevent open redirect attacks
 */
export const isValidInternalUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    // Relative URLs are safe
    return url.startsWith('/') && !url.startsWith('//');
  }
};

/**
 * Validate external URL
 */
export const isValidExternalUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Rate limiter for form submissions
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingMs = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Singleton rate limiter for order submissions
export const orderRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

/**
 * Detect potential bot submissions
 */
export const detectBot = (): boolean => {
  // Check for common bot indicators
  const indicators = [
    !navigator.cookieEnabled,
    !navigator.language,
    navigator.webdriver === true,
    !window.localStorage,
    !window.sessionStorage,
  ];
  
  return indicators.filter(Boolean).length >= 2;
};

/**
 * Generate honeypot field name
 * Bots often fill all fields, including hidden ones
 */
export const getHoneypotFieldName = (): string => {
  return 'website_url'; // Common field name that bots fill
};

/**
 * Validate honeypot field (should be empty)
 */
export const validateHoneypot = (value: string): boolean => {
  return !value || value.trim() === '';
};

/**
 * Get client fingerprint for rate limiting
 * Note: This is a simple implementation, not for tracking users
 */
export const getClientFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ];
  
  return components.join('|');
};

/**
 * Secure storage wrapper
 * Adds expiration and encryption-ready structure
 */
export const secureStorage = {
  set: (key: string, value: unknown, expiresInMs?: number): void => {
    const item = {
      value,
      timestamp: Date.now(),
      expires: expiresInMs ? Date.now() + expiresInMs : null,
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch {
      // Storage full or disabled
      console.warn('Unable to save to localStorage');
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      
      // Check expiration
      if (item.expires && Date.now() > item.expires) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value as T;
    } catch {
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};
