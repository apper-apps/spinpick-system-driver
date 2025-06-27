import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';

const themes = [
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4']
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#A78BFA', '#F9A8D4', '#FCD34D', '#6EE7B7', '#93C5FD', '#C4B5FD', '#FCA5A5', '#67E8F9']
  },
  {
    id: 'professional',
    name: 'Professional',
    colors: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#4B5563', '#111827', '#1F2937', '#F3F4F6']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#164E63', '#155E75', '#0891B2']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#F97316', '#EA580C', '#DC2626', '#B91C1C', '#991B1B', '#7C2D12', '#92400E', '#B45309']
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#059669', '#047857', '#065F46', '#064E3B', '#022C22', '#15803D', '#166534', '#14532D']
  },
  {
    id: 'candy',
    name: 'Candy',
    colors: ['#EC4899', '#BE185D', '#9D174D', '#831843', '#BE123C', '#E11D48', '#F43F5E', '#FB7185']
  },
  {
    id: 'electric',
    name: 'Electric',
    colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#7E22CE', '#A21CAF', '#BE185D']
  }
];

const ThemeSelector = ({ selectedTheme, onThemeChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
return (
    <div className="space-y-6">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-700 dark:text-dark-700">
          Appearance
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-200 dark:border-dark-200 hover:bg-surface-100 dark:hover:bg-dark-100 transition-colors"
        >
          <ApperIcon 
            name={isDarkMode ? "Sun" : "Moon"} 
            size={16} 
            className="text-surface-600 dark:text-dark-600" 
          />
          <span className="text-sm font-medium text-surface-700 dark:text-dark-700">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </motion.button>
      </div>

      {/* Color Theme Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-surface-700 dark:text-dark-700">
          Color Theme
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onThemeChange(theme)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTheme?.id === theme.id
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-surface-200 dark:border-dark-200 hover:border-surface-300 dark:hover:border-dark-300 bg-white dark:bg-dark-100'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {theme.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-surface-700 dark:text-dark-700">
                {theme.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;