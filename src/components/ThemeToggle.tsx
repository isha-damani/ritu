import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme or system preference
    const saved = localStorage.getItem('ritu_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ritu_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ritu_theme', 'dark');
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-muted"
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-ritu-warm-gray" />
      ) : (
        <Moon className="w-5 h-5 text-ritu-warm-gray" />
      )}
    </motion.button>
  );
}
