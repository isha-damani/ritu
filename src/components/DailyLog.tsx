import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, Meh, Frown, Heart, Zap, Moon,
  Check, Sparkles
} from 'lucide-react';
import { 
  getTodayLog, 
  saveDailyLog, 
  formatDateLong,
  type DailyLog as DailyLogType 
} from '@/lib/storage';

const MOODS = [
  { id: 'great', label: 'Great', icon: Sparkles, color: 'text-ritu-sage-deep' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-primary' },
  { id: 'okay', label: 'Okay', icon: Meh, color: 'text-ritu-warm-gray' },
  { id: 'low', label: 'Low', icon: Frown, color: 'text-muted-foreground' },
];

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'headache', label: 'Headache' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'backache', label: 'Back pain' },
  { id: 'breast-tenderness', label: 'Breast tenderness' },
  { id: 'mood-swings', label: 'Mood changes' },
  { id: 'acne', label: 'Skin changes' },
];

interface DailyLogProps {
  onLogSaved: () => void;
}

export function DailyLog({ onLogSaved }: DailyLogProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const todayLog = getTodayLog();
    if (todayLog) {
      setSelectedMood(todayLog.mood);
      setSelectedSymptoms(todayLog.symptoms);
    }
  }, []);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    const log: DailyLogType = {
      date: today,
      mood: selectedMood,
      symptoms: selectedSymptoms,
    };
    saveDailyLog(log);
    setSaved(true);
    onLogSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  const hasContent = selectedMood || selectedSymptoms.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="ritu-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="ritu-section-title mb-0 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Daily Check-in
        </h3>
        <span className="text-sm text-ritu-soft">
          {formatDateLong(new Date())}
        </span>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <label className="ritu-label">How are you feeling?</label>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(prev => prev === mood.id ? null : mood.id)}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
                  ${isSelected 
                    ? 'bg-ritu-blush-soft ring-2 ring-primary' 
                    : 'bg-secondary hover:bg-muted'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-6 h-6 ${isSelected ? mood.color : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${isSelected ? 'text-ritu' : 'text-ritu-soft'}`}>
                  {mood.label}
                </span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-6">
        <label className="ritu-label">Any symptoms today?</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <motion.button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected 
                    ? 'bg-ritu-blush-soft text-primary ring-1 ring-primary/30' 
                    : 'bg-secondary text-ritu-soft hover:bg-muted hover:text-ritu'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                {symptom.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        disabled={!hasContent}
        className="ritu-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileTap={{ scale: 0.98 }}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Logged for today
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Save today's log
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
