import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiPlay, FiX, FiChevronLeft, FiChevronRight, FiShare2 } from 'react-icons/fi';
import { getProductById, getImageUrl, parseImages } from '../api';
import OrderModal from '../components/OrderModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = ['ar', 'dz'].includes(i18n.language);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState({});

  // Share product function
  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Djellaba El Basma',
      text: `${product?.name} - ${product?.price?.toLocaleString()} DA\n${product?.description || ''}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert(i18n.language.startsWith('ar') || i18n.language === 'dz' 
          ? 'تم نسخ الرابط!' 
          : 'Lien copié!');
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      
      // Parse colors and sizes
      const colors = typeof data.colors === 'string' 
        ? JSON.parse(data.colors || '[]') 
        : (data.colors || []);
      const sizes = typeof data.sizes === 'string' 
        ? JSON.parse(data.sizes || '[]') 
        : (data.sizes || []);
      
      // Parse inventory (per-variant stock)
      let inv = {};
      if (data.inventory) {
        inv = typeof data.inventory === 'string' 
          ? JSON.parse(data.inventory || '{}') 
          : (data.inventory || {});
      }
      setInventory(inv);
      
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton rounded w-3/4" />
            <div className="h-6 skeleton rounded w-1/2" />
            <div className="h-12 skeleton rounded w-1/3" />
            <div className="h-24 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">{t('noProducts')}</p>
        <Link to="/products" className="btn-gold mt-4 inline-block">
          {t('products')}
        </Link>
      </div>
    );
  }

  // Parse product data
  const images = parseImages(product.images);
  
  const videos = parseImages(product.videos);
  
  const colors = typeof product.colors === 'string' 
    ? JSON.parse(product.colors || '[]') 
    : (product.colors || []);
  
  const sizes = typeof product.sizes === 'string' 
    ? JSON.parse(product.sizes || '[]') 
    : (product.sizes || []);

  const hasVideo = videos.length > 0;
  const inStock = product.inStock && product.quantity > 0;

  // Get stock for a specific color
  const getColorStock = (color) => {
    if (!inventory || Object.keys(inventory).length === 0) return null;
    let total = 0;
    Object.keys(inventory).forEach(key => {
      if (key.startsWith(color + '/') || key.startsWith(color + '-')) {
        total += inventory[key] || 0;
      }
    });
    return total > 0 ? total : null;
  };

  // Get stock for a specific color + size combination
  const getVariantStock = (color, size) => {
    if (!inventory || Object.keys(inventory).length === 0) return null;
    const key = `${color}/${size}`;
    const altKey = `${color}-${size}`;
    return inventory[key] ?? inventory[altKey] ?? null;
  };

  // Get current variant stock
  const currentVariantStock = selectedColor && selectedSize 
    ? getVariantStock(selectedColor, selectedSize) 
    : null;
  
  // Get current color stock (when only color is selected)
  const currentColorStock = selectedColor 
    ? getColorStock(selectedColor) 
    : null;

  // Determine max quantity for selector
  const maxQuantity = currentVariantStock !== null 
    ? currentVariantStock 
    : (currentColorStock !== null ? currentColorStock : product.quantity);

  // Navigation for images
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gold-600 transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-600 transition-colors">{t('products')}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 start-4 z-10 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                -15%
              </div>

              {/* Video Button */}
              {hasVideo && !showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute top-4 end-4 z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <FiPlay className="w-6 h-6 text-primary-600 ms-0.5" />
                </button>
              )}

              {/* Image/Video Display */}
              <AnimatePresence mode="wait">
                {showVideo && videos[0] ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <video
                      src={getImageUrl(videos[0])}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      controls
                      playsInline
                    />
                    <button
                      onClick={() => setShowVideo(false)}
                      className="absolute top-4 end-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.img
                    key={selectedImage}
                    src={getImageUrl(images[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && !showVideo && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    {isRTL ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    {isRTL ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {(images.length > 1 || hasVideo) && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === i && !showVideo 
                        ? 'border-gold-500' 
                        : 'border-transparent hover:border-gold-300'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {hasVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 relative bg-black transition-colors ${
                      showVideo 
                        ? 'border-gold-500' 
                        : 'border-transparent hover:border-gold-300'
                    }`}
                  >
                    <video src={getImageUrl(videos[0])} className="w-full h-full object-cover opacity-70" muted />
                    <FiPlay className="absolute inset-0 m-auto w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <span className="text-sm text-gold-600 font-medium uppercase tracking-wide">
              {product.category}
            </span>

            {/* Name & Share */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-800 flex-1">
                {product.name}
              </h1>
              <button
                onClick={handleShare}
                className="w-12 h-12 bg-gold-100 hover:bg-gold-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                title={i18n.language.startsWith('ar') || i18n.language === 'dz' ? 'مشاركة' : 'Partager'}
              >
                <FiShare2 className="w-5 h-5 text-gold-600" />
              </button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-primary-600">
                  {product.price?.toLocaleString()} <span className="text-lg">DA</span>
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t('priceIncludes')}
              </p>
              {product.priceWholesale && (
                <p className="text-sm text-gray-500">
                  {t('wholesalePrice')}: {product.priceWholesale?.toLocaleString()} DA ({t('forPieces')})
                </p>
              )}
            </div>

            {/* Stock Status */}
            {inStock ? (
              <p className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                {t('inStock')} ({product.quantity} {t('pieces')})
              </p>
            ) : (
              <p className="text-red-500 font-medium">{t('outOfStock')}</p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3">{t('colors')}</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color, i) => {
                    const colorStock = getColorStock(color);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColor(color);
                          setQuantity(1);
                        }}
                        className={`px-5 py-2 rounded-full border-2 font-medium transition-all flex items-center gap-2 ${
                          selectedColor === color
                            ? 'border-gold-500 bg-gold-50 text-gold-700'
                            : 'border-cream-300 hover:border-gold-300'
                        }`}
                      >
                        {color}
                        {colorStock !== null && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            colorStock > 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {colorStock > 0 ? colorStock : t('outOfStock')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedColor && currentColorStock !== null && !selectedSize && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    ✓ {t('remaining')}: {currentColorStock} {selectedColor}
                  </p>
                )}
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-3">{t('sizes')}</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size, i) => {
                    const variantStock = selectedColor ? getVariantStock(selectedColor, size) : null;
                    const isOutOfStock = variantStock === 0;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(size);
                            setQuantity(1);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`min-w-14 h-14 px-3 rounded-xl border-2 font-medium transition-all flex flex-col items-center justify-center ${
                          isOutOfStock 
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedSize === size
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-cream-300 hover:border-gold-300'
                        }`}
                      >
                        <span>{size}</span>
                        {variantStock !== null && variantStock > 0 && (
                          <span className="text-xs text-green-600 font-normal">{variantStock}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Show variant stock info */}
                {selectedColor && selectedSize && currentVariantStock !== null && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    currentVariantStock > 0 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`text-sm font-medium flex items-center gap-2 ${
                      currentVariantStock > 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {currentVariantStock > 0 ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          {t('remaining')}: {currentVariantStock} ({selectedColor} - {selectedSize})
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {t('outOfStockVariant')} ({selectedColor} - {selectedSize})
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">
                {t('quantity')} 
                {maxQuantity > 0 && (
                  <span className="text-sm font-normal text-gray-500 ms-2">
                    ({t('max')}: {maxQuantity})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-cream-300 hover:border-gold-400 flex items-center justify-center text-xl font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="w-12 h-12 rounded-xl border-2 border-cream-300 hover:border-gold-400 flex items-center justify-center text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={() => setShowOrderModal(true)}
              disabled={!inStock}
              className="w-full btn-gold text-xl py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingBag className="w-6 h-6" />
              {t('orderNow')}
            </button>

            {/* Delivery Price Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <FiTruck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium text-sm">{t('deliveryNotice')}</p>
                <p className="text-blue-600 text-xs mt-1">{t('deliveryNoticeDesc')}</p>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="text-amber-800 font-medium text-sm">{t('paymentCash')}</p>
                <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  {t('paymentBaridiMob')}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{t('freeDelivery')}</p>
                  <p className="text-xs text-gray-500">{t('deliveryInfo')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiShield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {i18n.language.startsWith('ar') || i18n.language === 'dz' ? 'جودة مضمونة' : 'Qualité garantie'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {i18n.language.startsWith('ar') || i18n.language === 'dz' ? '100% أصلي' : '100% authentique'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-cream-200">
                <h3 className="font-bold text-gray-800 mb-3">{t('description')}</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={{ ...product, selectedColor, selectedSize, quantity }}
      />
    </>
  );
}
