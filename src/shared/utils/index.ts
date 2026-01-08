/**
 * Shared Utilities - Public API
 */

// Validation
export {
  sanitizeInput,
  validateAlgerianPhone,
  validateName,
  validateCity,
  validateAddress,
  validateNotes,
  validateOrderForm,
  sanitizeOrderData,
} from './validation';

export type {
  ValidationResult,
  ValidationRules,
  FormErrors,
  OrderFormData,
} from './validation';

// Security
export {
  generateNonce,
  escapeHtml,
  isValidInternalUrl,
  isValidExternalUrl,
  orderRateLimiter,
  detectBot,
  getHoneypotFieldName,
  validateHoneypot,
  getClientFingerprint,
  secureStorage,
} from './security';
