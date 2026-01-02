import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Categories with icons/emojis
const categories = [
  { id: 'all', icon: '✨' },
  { id: 'djellaba', icon: '👗' },
  { id: 'caftan', icon: '👘' },
  { id: 'abaya', icon: '🧕' },
  { id: 'takchita', icon: '💃' },
  { id: 'ensemble', icon: '👔' },
  { id: 'other', icon: '🎁' },
];

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`category-tab flex items-center gap-2 ${
            activeCategory === category.id ? 'active' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{category.icon}</span>
          <span>{t(category.id === 'all' ? 'allProducts' : category.id)}</span>
        </motion.button>
      ))}
    </div>
  );
}
