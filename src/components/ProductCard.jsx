import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiPlay, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getImageUrl, parseImages } from '../api';

// Optimize Cloudinary images for faster loading
const getOptimizedImageUrl = (url, width = 300) => {
  if (!url) return '';
  // If it's a Cloudinary URL, add transformation
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto,dpr_auto/`);
  }
  return url;
};

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // First product should load immediately (LCP optimization)
  const isFirstProduct = index === 0;

  // Intersection Observer for lazy loading (skip for first product)
  useEffect(() => {
    if (isFirstProduct) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, [isFirstProduct]);

  // Parse product data
  const images = parseImages(product.images);
  
  const videos = parseImages(product.videos);
  
  const colors = typeof product.colors === 'string' 
    ? JSON.parse(product.colors || '[]') 
    : (product.colors || []);

  // Get first image or video
  const hasVideo = videos.length > 0;
  const hasMultipleImages = images.length > 1;
  const rawImageUrl = getImageUrl(images[currentImageIndex] || images[0]);
  const imageUrl = getOptimizedImageUrl(rawImageUrl, 300);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'ar-DZ').format(price);
  };

  // Check stock status
  const inStock = product.inStock && product.quantity > 0;

  // Image navigation
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="product-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-cream-200"
    >
      {/* Image/Video Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        {/* Discount Badge */}
        <div className="discount-badge z-10">
          -15%
        </div>

        {/* Image Counter Badge */}
        {hasMultipleImages && (
          <div className="absolute top-3 end-3 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Video Indicator Badge (shows video is available in detail page) */}
        {hasVideo && (
          <div className="absolute top-3 start-3 z-10 bg-primary-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <FiPlay className="w-3 h-3" />
            <span>Vidéo</span>
          </div>
        )}

        {/* Image Navigation Arrows - Always visible */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute start-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute end-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Dots Indicator - Always visible */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/30 px-3 py-1.5 rounded-full">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrentImageIndex(i); }}
                className={`rounded-full transition-all ${
                  currentImageIndex === i 
                    ? 'bg-white w-5 h-2' 
                    : 'bg-white/60 hover:bg-white/90 w-2 h-2'
                }`}
              />
            ))}
            {images.length > 5 && (
              <span className="text-white text-xs font-medium">+{images.length - 5}</span>
            )}
          </div>
        )}

        {/* Image - Only load when visible, NEVER show video on card */}
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          {isVisible && (
            <img
              src={imageUrl}
              alt={product.name}
              className={`product-image w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading={isFirstProduct ? "eager" : "lazy"}
              fetchpriority={isFirstProduct ? "high" : "auto"}
              decoding="async"
            />
          )}
        </>

        {/* Quick View Overlay */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
          aria-label={`${t('viewDetails')} - ${product.name}`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg" aria-hidden="true">
            <FiEye className="w-4 h-4" />
            {t('viewDetails')}
          </span>
        </Link>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-gold-700 font-medium uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-bold text-gray-800 mt-1 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-gray-500">+{colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div>
          <p className="text-xl font-bold text-primary-600">
            {formatPrice(product.price)} <span className="text-sm">DA</span>
          </p>
          {product.priceWholesale && (
            <p className="text-xs text-gray-500">
              {t('wholesalePrice')}: {formatPrice(product.priceWholesale)} DA
            </p>
          )}
        </div>

        {/* Buy Here Button */}
        <Link
          to={`/products/${product.id}`}
          className="mt-3 w-full btn-gold text-center flex items-center justify-center gap-2 py-2 text-sm"
          aria-label={`${t('buyHere')} - ${product.name}`}
        >
          <FiShoppingBag className="w-4 h-4" />
          {t('buyHere')}
        </Link>

        {/* Stock indicator */}
        {inStock && (
          <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {t('inStock')} ({product.quantity} {t('pieces')})
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to convert color names to hex
function getColorHex(colorName) {
  const colors = {
    'noir': '#1a1a1a',
    'noire': '#1a1a1a',
    'black': '#1a1a1a',
    'blanc': '#ffffff',
    'blanche': '#ffffff',
    'white': '#ffffff',
    'rouge': '#dc2626',
    'red': '#dc2626',
    'bleu': '#2563eb',
    'blue': '#2563eb',
    'vert': '#16a34a',
    'green': '#16a34a',
    'jaune': '#eab308',
    'yellow': '#eab308',
    'rose': '#ec4899',
    'pink': '#ec4899',
    'violet': '#7c3aed',
    'purple': '#7c3aed',
    'orange': '#f97316',
    'marron': '#78350f',
    'brown': '#78350f',
    'gris': '#6b7280',
    'grey': '#6b7280',
    'beige': '#d4b896',
    'doré': '#d4af37',
    'gold': '#d4af37',
    'argent': '#c0c0c0',
    'silver': '#c0c0c0',
    'bordeaux': '#722f37',
    'burgundy': '#722f37',
    'turquoise': '#40e0d0',
    'corail': '#ff7f50',
    'coral': '#ff7f50',
    'kaki': '#bdb76b',
    'khaki': '#bdb76b',
  };
  
  const lowerColor = colorName.toLowerCase().trim();
  return colors[lowerColor] || '#ddd';
}
