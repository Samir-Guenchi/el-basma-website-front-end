import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { getProducts } from '../api';

export default function ProductsPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(category || 'djellaba');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  const fetchProducts = async () => {
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProducts();
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(p => p.inStock && p.quantity > 0 && p.publishedOnWebsite)
    .filter(p => {
      if (activeCategory === 'all') return true;
      return p.category?.toLowerCase().includes(activeCategory.toLowerCase());
    })
    .filter(p => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory);
    // Update URL
    if (newCategory === 'all') {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 sticky top-[104px] md:top-[120px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-3 rounded-xl border-2 border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Sort products</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pe-10 rounded-xl border-2 border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 outline-none bg-white text-gray-700 font-medium cursor-pointer transition-all hover:border-gold-400 shadow-sm"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-cream-100 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-md text-gold-600' 
                      : 'hover:bg-cream-200 text-gray-500'
                  }`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-md text-gold-600' 
                      : 'hover:bg-cream-200 text-gray-500'
                  }`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </m.div>
        </LazyMotion>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {filteredProducts.length} {t('products')}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {[...Array(12)].map((_, i) => (
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
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📡</span>
            </div>
            <p className="text-gray-700 text-lg font-medium mb-2">{t('networkError') || 'Connection Error'}</p>
            <p className="text-gray-500 mb-6">{t('checkConnection') || 'Please check your internet connection'}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
            >
              {t('retry') || 'Try Again'}
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
