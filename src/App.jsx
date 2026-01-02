import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState('rtl');

  // Update document direction based on language
  useEffect(() => {
    const isRTL = ['ar', 'dz'].includes(i18n.language);
    setDirection(isRTL ? 'rtl' : 'ltr');
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={`min-h-screen flex flex-col ${direction === 'rtl' ? 'font-arabic' : ''}`}>
      <Toaster 
        position={direction === 'rtl' ? 'top-left' : 'top-right'}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/category/:category" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
      
      <Footer />
      
      <WhatsAppButton />
    </div>
  );
}

export default App;
