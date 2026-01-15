import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, ChevronUp, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { getDailyLogs, formatDate, formatDateLong, type DailyLog } from '@/lib/storage';

const MOOD_ICONS: Record<string, typeof Smile> = {
  great: Sparkles,
  good: Smile,
  okay: Meh,
  low: Frown,
};

const MOOD_COLORS: Record<string, string> = {
  great: 'text-ritu-sage-deep bg-ritu-sage',
  good: 'text-primary bg-ritu-blush-soft',
  okay: 'text-ritu-warm-gray bg-secondary',
  low: 'text-muted-foreground bg-muted',
};

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps',
  headache: 'Headache',
  bloating: 'Bloating',
  fatigue: 'Fatigue',
  backache: 'Back pain',
  'breast-tenderness': 'Breast tenderness',
  'mood-swings': 'Mood changes',
  acne: 'Skin changes',
};

interface HistoryViewProps {
  refreshKey: number;
}

export function HistoryView({ refreshKey }: HistoryViewProps) {
  const [expanded, setExpanded] = useState(true);
  const logs = getDailyLogs();

  // Group logs by week
  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(log);
    return acc;
  }, {} as Record<string, DailyLog[]>);

  const weeks = Object.entries(groupedLogs).slice(0, 4); // Show last 4 weeks

  if (logs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="ritu-card-static text-center py-8"
      >
        <History className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-medium text-ritu mb-1">No logs yet</h3>
        <p className="text-sm text-ritu-soft">
          Start logging your daily check-ins to see your history here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key={refreshKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="ritu-card-static"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="ritu-section-title mb-0 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Recent History
        </h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-6">
              {weeks.map(([weekKey, weekLogs]) => (
                <div key={weekKey}>
                  <p className="text-xs font-medium text-ritu-soft uppercase tracking-wide mb-3">
                    Week of {formatDate(weekKey)}
                  </p>
                  <div className="space-y-2">
                    {weekLogs.map((log, index) => {
                      const MoodIcon = log.mood ? MOOD_ICONS[log.mood] : null;
                      const moodColorClass = log.mood ? MOOD_COLORS[log.mood] : '';
                      
                      return (
                        <motion.div
                          key={log.date}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          {/* Mood indicator */}
                          <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${moodColorClass || 'bg-muted'}`}>
                            {MoodIcon ? (
                              <MoodIcon className="w-4 h-4" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ritu">
                              {formatDate(log.date)}
                            </p>
                            {log.symptoms.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {log.symptoms.map(symptom => (
                                  <span 
                                    key={symptom}
                                    className="text-xs px-2 py-0.5 rounded-full bg-background text-ritu-soft"
                                  >
                                    {SYMPTOM_LABELS[symptom] || symptom}
                                  </span>
                                ))}
                              </div>
                            )}
                            {!log.mood && log.symptoms.length === 0 && (
                              <p className="text-xs text-muted-foreground">No details logged</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
