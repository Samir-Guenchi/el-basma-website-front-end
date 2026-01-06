import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { getProducts } from '../api';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('djellaba'); // Djellaba as default
  const isRTL = ['ar', 'dz'].includes(i18n.language);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category (already filtered by publishedOnWebsite from API)
  const filteredProducts = activeCategory === 'all' 
    ? products.filter(p => p.inStock && p.quantity > 0 && p.publishedOnWebsite)
    : products.filter(p => 
        p.inStock && 
        p.quantity > 0 && 
        p.publishedOnWebsite &&
        p.category?.toLowerCase().includes(activeCategory.toLowerCase())
      );

  // Features
  const features = [
    { icon: FiTruck, titleAr: 'توصيل مجاني في مغنية', titleFr: 'Livraison gratuite à Maghnia' },
    { icon: FiShield, titleAr: 'جودة مضمونة', titleFr: 'Qualité garantie' },
    { icon: FiRefreshCw, titleAr: 'استبدال سهل', titleFr: 'Échange facile' },
    { icon: FiStar, titleAr: '-15% على كل المنتجات', titleFr: '-15% sur tout' },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Discount Badge */}
              <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block bg-gold-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg"
              >
                🎉 {t('heroDiscount')} 🎉
              </m.div>

              {/* Title */}
              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight"
            >
              {t('heroTitle')}
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              {t('heroSubtitle')}
            </m.p>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/products"
                className="btn-gold text-lg flex items-center justify-center gap-2"
              >
                {t('shopNow')}
                {isRTL ? <FiArrowLeft className="w-5 h-5" /> : <FiArrowRight className="w-5 h-5" />}
              </Link>
              <Link
                to="/products/djellaba"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-700"
              >
                {t('viewCollection')}
              </Link>
            </m.div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#fefdfb" d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,74.7C672,85,768,107,864,106.7C960,107,1056,85,1152,74.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-cream-50 border-b border-cream-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-gold-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? feature.titleAr : feature.titleFr}
                </span>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-800 mb-4">
              {t('products')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </m.div>

          {/* Category Filter */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </m.div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 skeleton rounded" />
                    <div className="h-6 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button 
                onClick={fetchProducts}
                className="btn-outline"
              >
                {t('retry') || 'Retry'}
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('noProducts')}</p>
            </div>
          )}

          {/* View All Button */}
          {filteredProducts.length > 12 && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to={`/products/${activeCategory}`}
                className="btn-outline inline-flex items-center gap-2"
              >
                {t('viewCollection')}
                {isRTL ? <FiArrowLeft className="w-5 h-5" /> : <FiArrowRight className="w-5 h-5" />}
              </Link>
            </m.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold-400 to-gold-500">
        <div className="container mx-auto px-4 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              {t('heroDiscount')}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {t('freeDelivery')} • {t('deliveryInfo')}
            </p>
            <Link
              to="/products"
              className="bg-white text-gold-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              {t('shopNow')}
              {isRTL ? <FiArrowLeft className="w-5 h-5" /> : <FiArrowRight className="w-5 h-5" />}
            </Link>
          </m.div>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}

