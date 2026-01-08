/**
 * Form Validation Utilities
 * 
 * Custom validation system replacing HTML5 native validation
 * with beautiful inline error messages and security sanitization.
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Field validation rules
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => ValidationResult;
}

// Form errors type
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
};

/**
 * Validate Algerian phone number
 * Formats: 05XXXXXXXX, 06XXXXXXXX, 07XXXXXXXX, +213XXXXXXXXX
 */
export const validateAlgerianPhone = (phone: string): ValidationResult => {
  const cleaned = phone.replace(/[\s\-\.]/g, '');
  
  // Algerian phone patterns
  const patterns = [
    /^0[567]\d{8}$/, // 05/06/07 + 8 digits
    /^\+213[567]\d{8}$/, // +213 + 5/6/7 + 8 digits
    /^00213[567]\d{8}$/, // 00213 + 5/6/7 + 8 digits
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleaned));
  
  return {
    isValid,
    error: isValid ? undefined : 'phoneInvalid',
  };
};

/**
 * Validate name (Arabic, French, or English)
 */
export const validateName = (name: string): ValidationResult => {
  const sanitized = sanitizeInput(name);
  
  if (!sanitized) {
    return { isValid: false, error: 'nameRequired' };
  }
  
  if (sanitized.length < 3) {
    return { isValid: false, error: 'nameMinLength' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'nameTooLong' };
  }
  
  // Allow Arabic, Latin letters, spaces, and common name characters
  const namePattern = /^[\u0600-\u06FF\u0750-\u077Fa-zA-ZÀ-ÿ\s\-'\.]+$/;
  
  if (!namePattern.test(sanitized)) {
    return { isValid: false, error: 'nameInvalidChars' };
  }
  
  return { isValid: true };
};

/**
 * Validate city/wilaya name
 */
export const validateCity = (city: string): ValidationResult => {
  const sanitized = sanitizeInput(city);
  
  if (!sanitized) {
    return { isValid: false, error: 'cityRequired' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'cityMinLength' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'cityTooLong' };
  }
  
  return { isValid: true };
};

/**
 * Validate address
 */
export const validateAddress = (address: string): ValidationResult => {
  const sanitized = sanitizeInput(address);
  
  if (!sanitized) {
    return { isValid: false, error: 'addressRequired' };
  }
  
  if (sanitized.length < 5) {
    return { isValid: false, error: 'addressMinLength' };
  }
  
  if (sanitized.length > 200) {
    return { isValid: false, error: 'addressTooLong' };
  }
  
  return { isValid: true };
};

/**
 * Validate notes (optional field)
 */
export const validateNotes = (notes: string): ValidationResult => {
  if (!notes) return { isValid: true };
  
  const sanitized = sanitizeInput(notes);
  
  if (sanitized.length > 500) {
    return { isValid: false, error: 'notesTooLong' };
  }
  
  return { isValid: true };
};

/**
 * Validate entire order form
 */
export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes: string;
}

export const validateOrderForm = (
  data: OrderFormData
): { isValid: boolean; errors: FormErrors<OrderFormData> } => {
  const errors: FormErrors<OrderFormData> = {};
  
  // Validate name
  const nameResult = validateName(data.customerName);
  if (!nameResult.isValid) {
    errors.customerName = nameResult.error;
  }
  
  // Validate phone
  const phoneResult = validateAlgerianPhone(data.customerPhone);
  if (!phoneResult.isValid) {
    errors.customerPhone = phoneResult.error;
  }
  
  // Validate city
  const cityResult = validateCity(data.customerCity);
  if (!cityResult.isValid) {
    errors.customerCity = cityResult.error;
  }
  
  // Validate address
  const addressResult = validateAddress(data.customerAddress);
  if (!addressResult.isValid) {
    errors.customerAddress = addressResult.error;
  }
  
  // Validate notes
  const notesResult = validateNotes(data.notes);
  if (!notesResult.isValid) {
    errors.notes = notesResult.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize order data before submission
 */
export const sanitizeOrderData = (data: OrderFormData): OrderFormData => {
  return {
    customerName: sanitizeInput(data.customerName),
    customerPhone: sanitizeInput(data.customerPhone).replace(/[\s\-\.]/g, ''),
    customerCity: sanitizeInput(data.customerCity),
    customerAddress: sanitizeInput(data.customerAddress),
    notes: sanitizeInput(data.notes),
  };
};
