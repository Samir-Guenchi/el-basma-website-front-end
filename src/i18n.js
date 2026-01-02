import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  ar: {
    translation: {
      // Header
      brand: 'جلابة البصمة',
      location: 'مغنية، الجزائر',
      home: 'الرئيسية',
      products: 'المنتجات',
      about: 'من نحن',
      contact: 'اتصل بنا',
      
      // Hero
      heroTitle: 'أناقة تقليدية بلمسة عصرية',
      heroSubtitle: 'اكتشفي أجمل الجلابات والقفاطين والعبايات',
      heroDiscount: 'تخفيض -15% على جميع المنتجات',
      shopNow: 'تسوّقي الآن',
      viewCollection: 'شاهدي المجموعة',
      
      // Categories
      allProducts: 'الكل',
      djellaba: 'جلابات',
      caftan: 'قفاطين',
      abaya: 'عبايات',
      takchita: 'تكشيطات',
      ensemble: 'طقم',
      other: 'أخرى',
      
      // Product
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      pieces: 'قطعة',
      addToCart: 'أضيفي للسلة',
      orderNow: 'اطلبي الآن',
      buyHere: 'اشتري من هنا',
      checkDelivery: 'اعرفي سعر التوصيل',
      deliveryPrice: 'سعر التوصيل',
      homeDelivery: 'التوصيل للمنزل',
      officeDelivery: 'التوصيل للمكتب',
      enterWilaya: 'أدخلي اسم الولاية وليس المدينة',
      wilayaNotFound: 'لم نجد هذه الولاية، أدخلي اسم الولاية',
      priceIncludes: 'السعر يشمل تخفيض -15%',
      wholesalePrice: 'سعر الجملة',
      retailPrice: 'سعر التجزئة',
      forPieces: 'لـ 3+ قطع',
      colors: 'الألوان',
      sizes: 'المقاسات',
      description: 'الوصف',
      
      // Order Form
      orderTitle: 'إتمام الطلب',
      orderSubtitle: 'أدخلي معلوماتك وسنتصل بك لتأكيد الطلب',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      city: 'المدينة',
      address: 'العنوان',
      quantity: 'الكمية',
      selectedColor: 'اللون',
      selectedSize: 'المقاس',
      notes: 'ملاحظات إضافية',
      itemsDetails: 'تفاصيل القطع',
      addItem: 'أضيفي قطعة',
      totalPrice: 'المبلغ الإجمالي',
      submitOrder: 'إرسال الطلب',
      orderSuccess: 'تم إرسال طلبك بنجاح! سنتصل بك قريباً للتأكيد',
      orderError: 'حدث خطأ، يرجى المحاولة مرة أخرى',
      
      // Delivery
      freeDelivery: 'توصيل مجاني في مغنية',
      deliveryInfo: 'التوصيل: 500-1500 دج للمدن الأخرى',
      deliveryNotice: 'شوفي سعر التوصيل لولايتك هنا ماشي في آخر خطوة!',
      deliveryNoticeDesc: 'عند الطلب أدخلي اسم الولاية وشوفي سعر التوصيل مباشرة',
      paymentCash: 'الدفع عند الاستلام (كاش)',
      paymentBaridiMob: 'بريدي موب قريباً إن شاء الله',
      
      // Footer
      followUs: 'تابعونا',
      contactUs: 'اتصلوا بنا',
      rights: 'جميع الحقوق محفوظة',
      madeWith: 'صُنع بـ ❤️ في الجزائر',
      
      // Misc
      loading: 'جاري التحميل...',
      noProducts: 'لا توجد منتجات',
      search: 'بحث...',
      viewDetails: 'عرض التفاصيل',
      close: 'إغلاق',
      weWillCall: 'سنتصل بك لتأكيد طلبك',
      selectLanguage: 'اختر اللغة',
      remaining: 'باقي',
      max: 'الحد الأقصى',
      outOfStockVariant: 'غير متوفر',
    }
  },
  dz: {
    translation: {
      // Header
      brand: 'جلابة البصمة',
      location: 'مغنية',
      home: 'الصفحة الرئيسية',
      products: 'المنتجات',
      about: 'علينا',
      contact: 'اتصل بينا',
      
      // Hero
      heroTitle: 'الأناقة التقليدية بلمسة عصرية',
      heroSubtitle: 'اكتشفي أحسن الجلابات والقفاطين والعبايات',
      heroDiscount: 'بروموسيون -15% على كلش',
      shopNow: 'تسوّقي دروك',
      viewCollection: 'شوفي المجموعة',
      
      // Categories
      allProducts: 'الكل',
      djellaba: 'جلابات',
      caftan: 'قفاطين',
      abaya: 'عبايات',
      takchita: 'تكشيطات',
      ensemble: 'طقم',
      other: 'حوايج أخرين',
      
      // Product
      inStock: 'كاين',
      outOfStock: 'ماكايناش',
      pieces: 'حاجة',
      addToCart: 'زيدي للسلة',
      orderNow: 'اطلبي دروك',
      buyHere: 'شري من هنا',
      checkDelivery: 'عرفي سوم التوصيل',
      deliveryPrice: 'سوم التوصيل',
      homeDelivery: 'التوصيل للدار',
      officeDelivery: 'التوصيل للبيرو',
      enterWilaya: 'دخلي اسم الولاية ماشي البلاصة',
      wilayaNotFound: 'مالقيناش هاد البلاصة، دخلي اسم الولاية',
      priceIncludes: 'السوم فيه التخفيض ديال -15%',
      wholesalePrice: 'سوم الگرو',
      retailPrice: 'سوم الديطاي',
      forPieces: 'لـ 3+ حوايج',
      colors: 'الألوان',
      sizes: 'القياسات',
      description: 'الوصف',
      
      // Order Form
      orderTitle: 'كمّلي الطلب',
      orderSubtitle: 'دخلي المعلومات تاعك وراح نعيطولك نكونفيرمو الطلب',
      fullName: 'الاسم الكامل',
      phone: 'رقم التيليفون',
      city: 'البلاصة',
      address: 'العنوان',
      quantity: 'الكمية',
      selectedColor: 'اللون',
      selectedSize: 'القياس',
      notes: 'ملاحظات زيادة',
      itemsDetails: 'تفاصيل الحوايج',
      addItem: 'زيدي حاجة',
      totalPrice: 'المبلغ الكلي',
      submitOrder: 'ابعثي الطلب',
      orderSuccess: 'تبعث الطلب تاعك! راح نعيطولك قريب نكونفيرمو',
      orderError: 'كاين مشكل، عاودي مرة أخرى',
      
      // Delivery
      freeDelivery: 'التوصيل بلاش في مغنية',
      deliveryInfo: 'التوصيل: 500-1500 دج للبلايص الأخرين',
      deliveryNotice: 'شوفي سوم التوصيل لولايتك هنا ماشي في لخر!',
      deliveryNoticeDesc: 'كي تطلبي دخلي اسم الولاية وشوفي سوم التوصيل ديريكت',
      paymentCash: 'الخلاص كي توصلك (كاش)',
      paymentBaridiMob: 'بريدي موب راه جاي قريب إن شاء الله',
      
      // Footer
      followUs: 'تابعونا',
      contactUs: 'عيطولنا',
      rights: 'كل الحقوق محفوظة',
      madeWith: 'مصنوع بـ ❤️ في الدزاير',
      
      // Misc
      loading: 'راه يحمّل...',
      noProducts: 'ماكاينش منتجات',
      search: 'قلّب...',
      viewDetails: 'شوفي التفاصيل',
      close: 'سكّر',
      weWillCall: 'راح نعيطولك نكونفيرمو الطلب',
      selectLanguage: 'اختار اللغة',
      remaining: 'باقي',
      max: 'الماكس',
      outOfStockVariant: 'سالات',
    }
  },
  fr: {
    translation: {
      // Header
      brand: 'Djellaba El Basma',
      location: 'Maghnia, Algérie',
      home: 'Accueil',
      products: 'Produits',
      about: 'À propos',
      contact: 'Contact',
      
      // Hero
      heroTitle: 'Élégance traditionnelle avec une touche moderne',
      heroSubtitle: 'Découvrez les plus belles djellabas, caftans et abayas',
      heroDiscount: 'Promotion -15% sur tous les articles',
      shopNow: 'Acheter maintenant',
      viewCollection: 'Voir la collection',
      
      // Categories
      allProducts: 'Tous',
      djellaba: 'Djellabas',
      caftan: 'Caftans',
      abaya: 'Abayas',
      takchita: 'Takchitas',
      ensemble: 'Ensembles',
      other: 'Autres',
      
      // Product
      inStock: 'En stock',
      outOfStock: 'Rupture de stock',
      pieces: 'pièces',
      addToCart: 'Ajouter au panier',
      orderNow: 'Commander',
      buyHere: 'Acheter ici',
      checkDelivery: 'Vérifier le prix de livraison',
      deliveryPrice: 'Prix de livraison',
      homeDelivery: 'Livraison à domicile',
      officeDelivery: 'Livraison au bureau',
      enterWilaya: 'Entrez le nom de la wilaya pas la ville',
      wilayaNotFound: 'Wilaya non trouvée, entrez le nom de la wilaya',
      priceIncludes: 'Prix incluant -15% de réduction',
      wholesalePrice: 'Prix de gros',
      retailPrice: 'Prix de détail',
      forPieces: 'pour 3+ pièces',
      colors: 'Couleurs',
      sizes: 'Tailles',
      description: 'Description',
      
      // Order Form
      orderTitle: 'Passer la commande',
      orderSubtitle: 'Entrez vos informations et nous vous appellerons pour confirmer',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      city: 'Ville',
      address: 'Adresse',
      quantity: 'Quantité',
      selectedColor: 'Couleur',
      selectedSize: 'Taille',
      notes: 'Notes supplémentaires',
      itemsDetails: 'Détails des articles',
      addItem: 'Ajouter un article',
      totalPrice: 'Prix total',
      submitOrder: 'Envoyer la commande',
      orderSuccess: 'Commande envoyée! Nous vous appellerons bientôt pour confirmer',
      orderError: 'Une erreur est survenue, veuillez réessayer',
      
      // Delivery
      freeDelivery: 'Livraison gratuite à Maghnia',
      deliveryInfo: 'Livraison: 500-1500 DA pour les autres villes',
      deliveryNotice: 'Voir le prix de livraison ici, pas à la dernière étape!',
      deliveryNoticeDesc: 'Entrez le nom de votre wilaya lors de la commande pour voir le prix',
      paymentCash: 'Paiement à la livraison (Cash)',
      paymentBaridiMob: 'Baridi Mob bientôt disponible inchallah',
      
      // Footer
      followUs: 'Suivez-nous',
      contactUs: 'Contactez-nous',
      rights: 'Tous droits réservés',
      madeWith: 'Fait avec ❤️ en Algérie',
      
      // Misc
      loading: 'Chargement...',
      noProducts: 'Aucun produit',
      search: 'Rechercher...',
      viewDetails: 'Voir détails',
      close: 'Fermer',
      weWillCall: 'Nous vous appellerons pour confirmer',
      selectLanguage: 'Choisir la langue',
      remaining: 'Restant',
      max: 'Max',
      outOfStockVariant: 'Épuisé',
    }
  },
  en: {
    translation: {
      // Header
      brand: 'Djellaba El Basma',
      location: 'Maghnia, Algeria',
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      
      // Hero
      heroTitle: 'Traditional Elegance with a Modern Touch',
      heroSubtitle: 'Discover the most beautiful djellabas, caftans and abayas',
      heroDiscount: '-15% discount on all items',
      shopNow: 'Shop Now',
      viewCollection: 'View Collection',
      
      // Categories
      allProducts: 'All',
      djellaba: 'Djellabas',
      caftan: 'Caftans',
      abaya: 'Abayas',
      takchita: 'Takchitas',
      ensemble: 'Sets',
      other: 'Other',
      
      // Product
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      pieces: 'pieces',
      addToCart: 'Add to Cart',
      orderNow: 'Order Now',
      buyHere: 'Buy Here',
      checkDelivery: 'Check delivery price',
      deliveryPrice: 'Delivery Price',
      homeDelivery: 'Home Delivery',
      officeDelivery: 'Office Delivery',
      enterWilaya: 'Enter wilaya name not city name',
      wilayaNotFound: 'Wilaya not found, enter the wilaya name',
      priceIncludes: 'Price includes -15% discount',
      wholesalePrice: 'Wholesale Price',
      retailPrice: 'Retail Price',
      forPieces: 'for 3+ pieces',
      colors: 'Colors',
      sizes: 'Sizes',
      description: 'Description',
      
      // Order Form
      orderTitle: 'Complete Your Order',
      orderSubtitle: 'Enter your details and we will call you to confirm',
      fullName: 'Full Name',
      phone: 'Phone',
      city: 'City',
      address: 'Address',
      quantity: 'Quantity',
      selectedColor: 'Color',
      selectedSize: 'Size',
      notes: 'Additional Notes',
      itemsDetails: 'Items Details',
      addItem: 'Add Item',
      totalPrice: 'Total Price',
      submitOrder: 'Submit Order',
      orderSuccess: 'Order submitted! We will call you soon to confirm',
      orderError: 'An error occurred, please try again',
      
      // Delivery
      freeDelivery: 'Free delivery in Maghnia',
      deliveryInfo: 'Delivery: 500-1500 DA for other cities',
      deliveryNotice: 'See delivery price for your wilaya here, not at the last step!',
      deliveryNoticeDesc: 'Enter your wilaya name when ordering to see the delivery price instantly',
      paymentCash: 'Cash on Delivery',
      paymentBaridiMob: 'Baridi Mob coming soon inchallah',
      
      // Footer
      followUs: 'Follow Us',
      contactUs: 'Contact Us',
      rights: 'All rights reserved',
      madeWith: 'Made with ❤️ in Algeria',
      
      // Misc
      loading: 'Loading...',
      noProducts: 'No products found',
      search: 'Search...',
      viewDetails: 'View Details',
      close: 'Close',
      weWillCall: 'We will call you to confirm your order',
      selectLanguage: 'Select Language',
      remaining: 'Remaining',
      max: 'Max',
      outOfStockVariant: 'Out of stock',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: 'ar', // Default to Arabic
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
