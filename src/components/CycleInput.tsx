import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, RotateCcw, Droplets, Check } from 'lucide-react';
import { type CycleSettings } from '@/lib/storage';

interface CycleInputProps {
  settings: CycleSettings;
  onSave: (settings: CycleSettings) => void;
}

export function CycleInput({ settings, onSave }: CycleInputProps) {
  const [lastPeriodStart, setLastPeriodStart] = useState(settings.lastPeriodStart || '');
  const [cycleLength, setCycleLength] = useState(settings.averageCycleLength);
  const [periodLength, setPeriodLength] = useState(settings.averagePeriodLength);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLastPeriodStart(settings.lastPeriodStart || '');
    setCycleLength(settings.averageCycleLength);
    setPeriodLength(settings.averagePeriodLength);
  }, [settings]);

  const handleSave = () => {
    onSave({
      lastPeriodStart: lastPeriodStart || null,
      averageCycleLength: cycleLength,
      averagePeriodLength: periodLength,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = 
    lastPeriodStart !== (settings.lastPeriodStart || '') ||
    cycleLength !== settings.averageCycleLength ||
    periodLength !== settings.averagePeriodLength;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="ritu-card"
    >
      <h3 className="ritu-section-title flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        Cycle Information
      </h3>

      <div className="grid gap-5">
        {/* Last Period Start */}
        <div>
          <label className="ritu-label">Last period started</label>
          <input
            type="date"
            value={lastPeriodStart}
            onChange={(e) => setLastPeriodStart(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="ritu-input"
          />
        </div>

        {/* Cycle Length */}
        <div>
          <label className="ritu-label flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Average cycle length
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="21"
              max="40"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
            <span className="w-20 text-center font-medium text-ritu bg-secondary rounded-lg py-2">
              {cycleLength} days
            </span>
          </div>
        </div>

        {/* Period Length */}
        <div>
          <label className="ritu-label flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Average period length
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="2"
              max="10"
              value={periodLength}
              onChange={(e) => setPeriodLength(Number(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
            <span className="w-20 text-center font-medium text-ritu bg-secondary rounded-lg py-2">
              {periodLength} days
            </span>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={!hasChanges && !saved}
          className="ritu-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.98 }}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
