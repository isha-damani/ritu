import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Check } from 'lucide-react';
import { getFlowLog, saveFlowLog, type FlowLog } from '@/lib/storage';

const FLOW_LEVELS = [
  { 
    id: 'spotting', 
    label: 'Spotting', 
    color: 'bg-flow-spotting',
    textColor: 'text-flow-spotting',
    description: 'Very light'
  },
  { 
    id: 'light', 
    label: 'Light', 
    color: 'bg-flow-light',
    textColor: 'text-flow-light',
    description: 'Minimal'
  },
  { 
    id: 'medium', 
    label: 'Medium', 
    color: 'bg-flow-medium',
    textColor: 'text-flow-medium',
    description: 'Moderate'
  },
  { 
    id: 'heavy', 
    label: 'Heavy', 
    color: 'bg-flow-heavy',
    textColor: 'text-flow-heavy',
    description: 'Significant'
  },
];

interface FlowTrackingProps {
  onFlowSaved?: () => void;
}

export function FlowTracking({ onFlowSaved }: FlowTrackingProps) {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const todayFlow = getFlowLog();
    if (todayFlow) {
      setSelectedFlow(todayFlow.level);
    }
  }, []);

  const handleSave = () => {
    if (!selectedFlow) return;
    
    const today = new Date().toISOString().split('T')[0];
    const log: FlowLog = {
      date: today,
      level: selectedFlow,
    };
    saveFlowLog(log);
    setSaved(true);
    onFlowSaved?.();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="ritu-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="ritu-section-title mb-0 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-flow-medium" />
          Flow Tracking
        </h3>
      </div>

      <div className="mb-4">
        <label className="ritu-label">How's your flow today?</label>
        <div className="grid grid-cols-4 gap-2">
          {FLOW_LEVELS.map((flow) => {
            const isSelected = selectedFlow === flow.id;
            return (
              <motion.button
                key={flow.id}
                onClick={() => setSelectedFlow(prev => prev === flow.id ? null : flow.id)}
                className={`
                  relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                  ${isSelected 
                    ? 'ring-2 ring-primary bg-ritu-blush-soft' 
                    : 'bg-secondary hover:bg-muted'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-6 h-6 rounded-full ${flow.color}`} />
                <span className={`text-xs font-medium ${isSelected ? 'text-ritu' : 'text-ritu-soft'}`}>
                  {flow.label}
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

      {/* Flow legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FLOW_LEVELS.map((flow) => (
          <div key={flow.id} className="flex items-center gap-1.5 text-xs text-ritu-soft">
            <div className={`w-2.5 h-2.5 rounded-full ${flow.color}`} />
            <span>{flow.description}</span>
          </div>
        ))}
      </div>

      <motion.button
        onClick={handleSave}
        disabled={!selectedFlow}
        className="ritu-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileTap={{ scale: 0.98 }}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Flow logged
          </>
        ) : (
          <>
            <Droplet className="w-4 h-4" />
            Log flow
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
