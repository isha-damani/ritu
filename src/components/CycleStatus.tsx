import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { 
  calculateCycleDay, 
  calculateNextPeriod, 
  getDaysUntil, 
  formatDate,
  getCyclePhase,
  getPhaseDescription,
  type CycleSettings 
} from '@/lib/storage';

interface CycleStatusProps {
  settings: CycleSettings;
}

export function CycleStatus({ settings }: CycleStatusProps) {
  if (!settings.lastPeriodStart) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ritu-card-static text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ritu-blush-soft flex items-center justify-center">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-ritu mb-2">Welcome to Ritu</h3>
        <p className="text-ritu-soft max-w-sm mx-auto">
          Add your cycle information below to start tracking. Your data stays private on this device.
        </p>
      </motion.div>
    );
  }

  const cycleDay = calculateCycleDay(settings.lastPeriodStart);
  const nextPeriod = calculateNextPeriod(settings.lastPeriodStart, settings.averageCycleLength);
  const daysUntil = getDaysUntil(nextPeriod);
  const phase = getCyclePhase(cycleDay, settings.averageCycleLength);
  const progress = (cycleDay / settings.averageCycleLength) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ritu-card"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Cycle Progress Ring */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--ritu-blush-soft))"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 42 * (1 - Math.min(progress, 100) / 100) 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-ritu">
                {cycleDay}
              </span>
              <span className="text-sm text-ritu-soft">day</span>
            </div>
          </div>
        </div>

        {/* Cycle Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="ritu-badge">{getPhaseDescription(phase)}</span>
            </div>
            <h2 className="text-2xl font-semibold text-ritu mt-2">
              Day {cycleDay} of your cycle
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <div className="bg-ritu-cream rounded-xl px-4 py-3">
              <p className="text-sm text-ritu-soft">Next period around</p>
              <p className="font-medium text-ritu">{formatDate(nextPeriod)}</p>
            </div>
            <div className="bg-ritu-sage rounded-xl px-4 py-3">
              <p className="text-sm text-ritu-sage-deep">Approximately</p>
              <p className="font-medium text-ritu">
                {daysUntil > 0 ? `${daysUntil} days away` : 'Expected soon'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
