import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiPhone, FiUser, FiMapPin, FiMessageSquare, FiTruck, FiSearch, FiPlus, FiMinus } from 'react-icons/fi';
import { createOrder, searchDelivery, getImageUrl, parseImages } from '../api';
import toast from 'react-hot-toast';

export default function OrderModal({ isOpen, onClose, product }) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerCity: '',
    customerAddress: '',
    notes: '',
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Items array for multiple products with different colors/sizes
  const [items, setItems] = useState([{ color: '', size: '' }]);

  // Parse product data
  const colors = typeof product?.colors === 'string' 
    ? JSON.parse(product?.colors || '[]') 
    : (product?.colors || []);
  
  const sizes = typeof product?.sizes === 'string' 
    ? JSON.parse(product?.sizes || '[]') 
    : (product?.sizes || []);

  // Initialize items when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      const qty = product.quantity || 1;
      if (qty === 1 && product.selectedColor && product.selectedSize) {
        // Single item with pre-selected options
        setItems([{ color: product.selectedColor, size: product.selectedSize }]);
      } else if (qty > 1) {
        // Multiple items - initialize array
        setItems(Array(qty).fill(null).map(() => ({ 
          color: product.selectedColor || '', 
          size: product.selectedSize || '' 
        })));
      } else {
        setItems([{ color: product.selectedColor || '', size: product.selectedSize || '' }]);
      }
    }
  }, [isOpen, product]);

  // Add item
  const addItem = () => {
    setItems([...items, { color: colors[0] || '', size: sizes[0] || '' }]);
  };

  // Remove item
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Check delivery price when city changes
  const checkDeliveryPrice = async (cityName) => {
    if (!cityName || cityName.length < 2) {
      setDeliveryInfo(null);
      setDeliveryError('');
      return;
    }
    
    setDeliveryLoading(true);
    setDeliveryError('');
    
    try {
      const results = await searchDelivery(cityName);
      if (results && results.length > 0) {
        setDeliveryInfo(results[0]);
        setDeliveryError('');
      } else {
        setDeliveryInfo(null);
        setDeliveryError(t('wilayaNotFound'));
      }
    } catch (error) {
      setDeliveryInfo(null);
      setDeliveryError(t('wilayaNotFound'));
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Auto-check delivery when city field changes
    if (name === 'customerCity') {
      // Debounce: wait 500ms after user stops typing
      clearTimeout(window.deliveryTimeout);
      window.deliveryTimeout = setTimeout(() => {
        checkDeliveryPrice(value);
      }, 500);
    }
  };

  // Format items details for order notes
  const formatItemsDetails = () => {
    if (items.length === 1) {
      return items[0].color && items[0].size 
        ? `${items[0].color} - ${items[0].size}` 
        : items[0].color || items[0].size || '';
    }
    return items.map((item, i) => `${i + 1}. ${item.color || '-'} / ${item.size || '-'}`).join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation with specific error messages
    const errors = [];
    
    if (!formData.customerName || formData.customerName.trim().length < 3) {
      errors.push(t('nameRequired') || 'الاسم الكامل مطلوب (3 أحرف على الأقل)');
    }
    
    if (!formData.customerPhone || formData.customerPhone.trim().length < 10) {
      errors.push(t('phoneRequired') || 'رقم الهاتف مطلوب (10 أرقام على الأقل)');
    }
    
    if (!formData.customerCity || formData.customerCity.trim().length < 2) {
      errors.push(t('cityRequired') || 'الولاية مطلوبة');
    }
    
    if (!formData.customerAddress || formData.customerAddress.trim().length < 5) {
      errors.push(t('addressRequired') || 'العنوان مطلوب (5 أحرف على الأقل)');
    }
    
    // Validate items (color/size if available)
    if (colors.length > 0 || sizes.length > 0) {
      const hasEmptyItems = items.some(item => {
        if (colors.length > 0 && !item.color) return true;
        if (sizes.length > 0 && !item.size) return true;
        return false;
      });
      
      if (hasEmptyItems) {
        errors.push(t('selectColorSize') || 'يرجى اختيار اللون والمقاس لجميع المنتجات');
      }
    }
    
    // Show all errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { duration: 4000 }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order details with all items
      const itemsDetails = formatItemsDetails();
      const orderNotes = items.length > 1 
        ? `${t('itemsDetails')}:\n${itemsDetails}\n\n${formData.notes || ''}`
        : formData.notes;

      await createOrder({
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
      });

      setOrderSuccess(true);
      toast.success(t('orderSuccess'));
      
      // Reset form after delay
      setTimeout(() => {
        setOrderSuccess(false);
        setFormData({
          customerName: '',
          customerPhone: '',
          customerCity: '',
          customerAddress: '',
          notes: '',
        });
        setItems([{ color: '', size: '' }]);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error(t('orderError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {orderSuccess ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FiCheck className="w-10 h-10 text-green-800" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('orderSuccess')}</h3>
              <p className="text-gray-600">{t('weWillCall')}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-cream-200 p-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{t('orderTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('orderSubtitle')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-cream-100 flex items-center justify-center transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Product Summary */}
              <div className="p-4 bg-cream-50 border-b border-cream-200">
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(parseImages(product.images)[0])}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <p className="text-primary-600 font-bold">
                      {product.price?.toLocaleString()} DA
                    </p>
                    <p className="text-xs text-green-800 mt-1">{t('priceIncludes')}</p>
                    
                    {/* Show selected options */}
                    {(product.selectedColor || product.selectedSize || product.quantity > 1) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.quantity > 1 && (
                          <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full">
                            {t('quantity')}: {product.quantity}
                          </span>
                        )}
                        {product.selectedColor && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {product.selectedColor}
                          </span>
                        )}
                        {product.selectedSize && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {product.selectedSize}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="form-label flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gold-500" />
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`form-input ${formErrors.customerName ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                    minLength={3}
                  />
                  {formErrors.customerName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="form-label flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-gold-500" />
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className={`form-input ${formErrors.customerPhone ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="0550 00 00 00"
                    dir="ltr"
                    required
                    minLength={10}
                  />
                  {formErrors.customerPhone && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.customerPhone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="form-label flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-gold-500" />
                    {t('city')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customerCity"
                      value={formData.customerCity}
                      onChange={handleChange}
                      className={`form-input ${formErrors.customerCity ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder={t('enterWilaya')}
                      required
                    />
                    {deliveryLoading && (
                      <div className="absolute end-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {formErrors.customerCity && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.customerCity}</p>
                  )}
                  
                  {/* Delivery Price Display */}
                  {deliveryInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                        <FiTruck className="w-4 h-4" />
                        {t('deliveryPrice')} - {deliveryInfo.city}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between bg-white rounded px-3 py-2">
                          <span className="text-gray-600">{t('homeDelivery')}</span>
                          <span className="font-bold text-green-800">{deliveryInfo.home} DA</span>
                        </div>
                        <div className="flex justify-between bg-white rounded px-3 py-2">
                          <span className="text-gray-600">{t('officeDelivery')}</span>
                          <span className="font-bold text-green-800">{deliveryInfo.office} DA</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Error Message */}
                  {deliveryError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-orange-600 flex items-center gap-1"
                    >
                      ⚠️ {deliveryError}
                    </motion.p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="form-label">{t('address')} *</label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    className={`form-input ${formErrors.customerAddress ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                    minLength={5}
                  />
                  {formErrors.customerAddress && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.customerAddress}</p>
                  )}
                </div>

                {/* Items List - Color & Size for each item */}
                {(colors.length > 0 || sizes.length > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="form-label mb-0">{t('itemsDetails')} ({items.length})</label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 text-sm text-gold-700 hover:text-gold-800 font-medium"
                      >
                        <FiPlus className="w-4 h-4" />
                        {t('addItem')}
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 bg-cream-50 rounded-lg p-3 border border-cream-200"
                        >
                          <span className="w-6 h-6 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          
                          {/* Color selector */}
                          {colors.length > 0 && (
                            <select
                              value={item.color}
                              onChange={(e) => updateItem(index, 'color', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-cream-300 text-sm focus:border-gold-400 outline-none"
                            >
                              <option value="">{t('selectedColor')}</option>
                              {colors.map((c, i) => (
                                <option key={i} value={c}>{c}</option>
                              ))}
                            </select>
                          )}
                          
                          {/* Size selector */}
                          {sizes.length > 0 && (
                            <select
                              value={item.size}
                              onChange={(e) => updateItem(index, 'size', e.target.value)}
                              className="w-20 px-3 py-2 rounded-lg border border-cream-300 text-sm focus:border-gold-400 outline-none"
                            >
                              <option value="">{t('selectedSize')}</option>
                              {sizes.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                          
                          {/* Remove button */}
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Total price */}
                    <div className="flex justify-between items-center bg-gold-50 rounded-lg p-3 border border-gold-200">
                      <span className="text-sm font-medium text-gray-700">{t('totalPrice')}</span>
                      <span className="text-lg font-bold text-primary-600">
                        {(product.price * items.length).toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="form-label flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4 text-gold-500" />
                    {t('notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-input resize-none"
                    rows={3}
                  />
                </div>

                {/* Delivery Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700 font-medium">{t('freeDelivery')}</p>
                  <p className="text-xs text-green-800 mt-1">{t('deliveryInfo')}</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('loading') : t('submitOrder')}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
