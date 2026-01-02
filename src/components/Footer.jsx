import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram, FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: FiFacebook, href: 'https://web.facebook.com/BOUtiqueOUssamAyaaKOub', label: 'Facebook' },
    { icon: FiInstagram, href: 'https://www.instagram.com/jellaba_el.basma_maghnia/', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@jellaba_el.basma', label: 'TikTok' },
    { icon: FaWhatsapp, href: 'https://wa.me/213780723779', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold font-display">ب</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">{t('brand')}</h3>
                <p className="text-gray-400 text-sm">{t('location')}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-md">
              {t('heroSubtitle')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gold-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gold-400">{t('products')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/djellaba" className="text-gray-400 hover:text-gold-400 transition-colors">
                  {t('djellaba')}
                </Link>
              </li>
              <li>
                <Link to="/products/caftan" className="text-gray-400 hover:text-gold-400 transition-colors">
                  {t('caftan')}
                </Link>
              </li>
              <li>
                <Link to="/products/abaya" className="text-gray-400 hover:text-gold-400 transition-colors">
                  {t('abaya')}
                </Link>
              </li>
              <li>
                <Link to="/products/takchita" className="text-gray-400 hover:text-gold-400 transition-colors">
                  {t('takchita')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gold-400">{t('contactUs')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>Maghnia, Tlemcen, Algeria</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a href="tel:+213780723779" className="hover:text-gold-400 transition-colors" dir="ltr">
                  +213 780 723 779
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaWhatsapp className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href="https://wa.me/213780723779" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" dir="ltr">
                  WhatsApp
                </a>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <p className="text-sm text-gold-400 font-medium">{t('freeDelivery')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('deliveryInfo')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {t('brand')}. {t('rights')}
            </p>
            <p className="text-gray-500 text-sm">
              {t('madeWith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
