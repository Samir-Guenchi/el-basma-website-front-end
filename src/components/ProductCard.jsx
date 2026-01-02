import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiPlay, FiEye } from 'react-icons/fi';
import { getImageUrl, parseImages } from '../api';

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Parse product data
  const images = parseImages(product.images);
  
  const videos = parseImages(product.videos);
  
  const colors = typeof product.colors === 'string' 
    ? JSON.parse(product.colors || '[]') 
    : (product.colors || []);

  // Get first image or video
  const hasVideo = videos.length > 0;
  const imageUrl = getImageUrl(images[0]);
  const videoUrl = videos[0] ? getImageUrl(videos[0]) : null;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'ar-DZ').format(price);
  };

  // Check stock status
  const inStock = product.inStock && product.quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-cream-200"
    >
      {/* Image/Video Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        {/* Discount Badge */}
        <div className="discount-badge z-10">
          -15%
        </div>

        {/* Video Play Button (if has video) */}
        {hasVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute top-3 end-3 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <FiPlay className="w-5 h-5 text-primary-600 ms-0.5" />
          </button>
        )}

        {/* Image */}
        {!showVideo && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className={`product-image w-full h-full object-cover ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        )}

        {/* Video */}
        {showVideo && videoUrl && (
          <div className="absolute inset-0">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 end-3 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick View Overlay */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg">
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
        <span className="text-xs text-gold-600 font-medium uppercase tracking-wide">
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
        >
          <FiShoppingBag className="w-4 h-4" />
          {t('buyHere')}
        </Link>

        {/* Stock indicator */}
        {inStock && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
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
