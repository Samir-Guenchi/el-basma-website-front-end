import { useTranslation } from 'react-i18next';
import { FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية الفصحى', flag: '🇸🇦' },
  { code: 'dz', name: 'الدارجة', nativeName: 'الدارجة الجزائرية', flag: '🇩🇿' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
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
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors ${
            i18n.language === lang.code ? 'bg-gold-50 dark:bg-gold-900/30' : ''
          }`}
        >
          <span className="text-2xl">{lang.flag}</span>
          <div className="flex-grow text-start">
            <div className={`font-medium ${
              i18n.language === lang.code 
                ? 'text-gold-700 dark:text-gold-400' 
                : 'text-gray-800 dark:text-gray-200'
            }`}>
              {lang.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{lang.nativeName}</div>
          </div>
          {i18n.language === lang.code && (
            <FiCheck className="w-5 h-5 text-gold-600 dark:text-gold-400" />
          )}
        </button>
      ))}
    </div>
  );
}
