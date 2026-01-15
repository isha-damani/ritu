// Local storage utilities for Ritu - privacy-first cycle tracking

export interface CycleSettings {
  lastPeriodStart: string | null;
  averageCycleLength: number;
  averagePeriodLength: number;
}

export interface DailyLog {
  date: string;
  mood: string | null;
  symptoms: string[];
  notes?: string;
}

export interface FlowLog {
  date: string;
  level: string; // spotting, light, medium, heavy
}

export interface CycleData {
  startDate: string;
  endDate?: string;
  logs: DailyLog[];
}

const STORAGE_KEYS = {
  SETTINGS: 'ritu_settings',
  DAILY_LOGS: 'ritu_daily_logs',
  CYCLES: 'ritu_cycles',
  FLOW_LOGS: 'ritu_flow_logs',
};

// Default settings
const defaultSettings: CycleSettings = {
  lastPeriodStart: null,
  averageCycleLength: 28,
  averagePeriodLength: 5,
};

// Settings
export function getSettings(): CycleSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return defaultSettings;
}

export function saveSettings(settings: CycleSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

// Daily logs
export function getDailyLogs(): DailyLog[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading daily logs:', e);
  }
  return [];
}

export function saveDailyLog(log: DailyLog): void {
  try {
    const logs = getDailyLogs();
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    // Sort by date descending
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving daily log:', e);
  }
}

export function getTodayLog(): DailyLog | null {
  const today = new Date().toISOString().split('T')[0];
  const logs = getDailyLogs();
  return logs.find(l => l.date === today) || null;
}

// Flow logs
export function getFlowLogs(): FlowLog[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FLOW_LOGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading flow logs:', e);
  }
  return [];
}

export function saveFlowLog(log: FlowLog): void {
  try {
    const logs = getFlowLogs();
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    // Sort by date descending
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    localStorage.setItem(STORAGE_KEYS.FLOW_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving flow log:', e);
  }
}

export function getFlowLog(): FlowLog | null {
  const today = new Date().toISOString().split('T')[0];
  const logs = getFlowLogs();
  return logs.find(l => l.date === today) || null;
}

// Cycle calculations
export function calculateCycleDay(lastPeriodStart: string): number {
  const start = new Date(lastPeriodStart);
  const today = new Date();
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the first day of period
}

export function calculateNextPeriod(lastPeriodStart: string, cycleLength: number): Date {
  const start = new Date(lastPeriodStart);
  const nextPeriod = new Date(start);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  return nextPeriod;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysUntil(targetDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getCyclePhase(cycleDay: number, cycleLength: number): string {
  const ovulationDay = Math.round(cycleLength / 2);
  
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= ovulationDay - 3) return 'follicular';
  if (cycleDay <= ovulationDay + 1) return 'ovulation';
  return 'luteal';
}

export function getPhaseDescription(phase: string): string {
  const descriptions: Record<string, string> = {
    menstrual: 'Menstrual phase',
    follicular: 'Follicular phase',
    ovulation: 'Ovulation window',
    luteal: 'Luteal phase',
  };
  return descriptions[phase] || 'Current phase';
}
