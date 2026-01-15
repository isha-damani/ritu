import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { 
  getSettings, 
  getDailyLogs, 
  getFlowLogs,
  type CycleSettings 
} from '@/lib/storage';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarViewProps {
  settings: CycleSettings;
}

export function CalendarView({ settings }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const dailyLogs = getDailyLogs();
  const flowLogs = getFlowLogs();

  // Get all period days based on settings and flow logs
  const periodDays = useMemo(() => {
    const days = new Set<string>();
    
    // Add flow log dates
    flowLogs.forEach(log => {
      days.add(log.date);
    });
    
    // Calculate period days from last period start
    if (settings.lastPeriodStart) {
      const startDate = new Date(settings.lastPeriodStart);
      for (let i = 0; i < settings.averagePeriodLength; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        days.add(date.toISOString().split('T')[0]);
      }
      
      // Also add predicted periods (next 3 cycles)
      for (let cycle = 1; cycle <= 3; cycle++) {
        const cycleStart = new Date(startDate);
        cycleStart.setDate(cycleStart.getDate() + (settings.averageCycleLength * cycle));
        for (let i = 0; i < settings.averagePeriodLength; i++) {
          const date = new Date(cycleStart);
          date.setDate(date.getDate() + i);
          // Mark as predicted only if in the future
          if (date > new Date()) {
            days.add(date.toISOString().split('T')[0]);
          }
        }
      }
    }
    
    return days;
  }, [settings, flowLogs]);

  // Get days in current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    
    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPeriodDay = (date: Date) => {
    return periodDays.has(date.toISOString().split('T')[0]);
  };

  const isFuturePrediction = (date: Date) => {
    return isPeriodDay(date) && date > new Date();
  };

  const getFlowLevel = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const log = flowLogs.find(l => l.date === dateStr);
    return log?.level || null;
  };

  const hasLog = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dailyLogs.some(l => l.date === dateStr);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="ritu-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="ritu-section-title mb-0 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Calendar
        </h3>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={() => navigateMonth('prev')}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4 text-ritu-soft" />
        </motion.button>
        <span className="text-sm font-medium text-ritu">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <motion.button
          onClick={() => navigateMonth('next')}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4 text-ritu-soft" />
        </motion.button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-ritu-soft py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isPeriod = isPeriodDay(day.date);
          const isFuture = isFuturePrediction(day.date);
          const flowLevel = getFlowLevel(day.date);
          const logged = hasLog(day.date);
          
          return (
            <motion.div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                ${!day.isCurrentMonth ? 'text-muted-foreground/40' : 'text-ritu'}
                ${isToday(day.date) ? 'ring-2 ring-primary ring-offset-1 ring-offset-background font-semibold' : ''}
                ${isPeriod && !isFuture ? 'bg-period text-period-foreground font-medium' : ''}
                ${isFuture ? 'bg-period-predicted text-period-foreground/80' : ''}
              `}
              whileHover={{ scale: 1.05 }}
            >
              {day.date.getDate()}
              
              {/* Flow indicator dot */}
              {flowLevel && (
                <div className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-flow-${flowLevel}`} />
              )}
              
              {/* Log indicator */}
              {logged && !isPeriod && (
                <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-ritu-sage-deep" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-ritu-soft">
          <div className="w-3 h-3 rounded bg-period" />
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ritu-soft">
          <div className="w-3 h-3 rounded bg-period-predicted" />
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ritu-soft">
          <div className="w-2 h-2 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
      </div>
    </motion.div>
  );
}
