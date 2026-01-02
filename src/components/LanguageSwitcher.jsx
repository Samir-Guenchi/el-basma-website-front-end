import { useTranslation } from 'react-i18next';
import { FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'dz', name: 'الدارجة', flag: '🇩🇿' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher({ onSelect }) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    if (onSelect) onSelect();
  };

  return (
    <div className="py-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-100 transition-colors ${
            i18n.language === lang.code ? 'bg-gold-50' : ''
          }`}
        >
          <span className="text-xl">{lang.flag}</span>
          <span className={`flex-grow text-start ${
            i18n.language === lang.code ? 'font-medium text-gold-700' : 'text-gray-700'
          }`}>
            {lang.name}
          </span>
          {i18n.language === lang.code && (
            <FiCheck className="w-5 h-5 text-gold-600" />
          )}
        </button>
      ))}
    </div>
  );
}
