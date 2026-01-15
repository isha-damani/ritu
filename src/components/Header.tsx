import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-ritu-blush-soft flex items-center justify-center">
          <Flower2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-ritu tracking-tight">Ritu</h1>
          <p className="text-ritu-soft text-xs">A gentle companion for your cycle</p>
        </div>
      </div>
      <ThemeToggle />
    </motion.header>
  );
}
