import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CycleStatus } from '@/components/CycleStatus';
import { CycleInput } from '@/components/CycleInput';
import { DailyLog } from '@/components/DailyLog';
import { FlowTracking } from '@/components/FlowTracking';
import { CalendarView } from '@/components/CalendarView';
import { HistoryView } from '@/components/HistoryView';
import { getSettings, saveSettings, type CycleSettings } from '@/lib/storage';
import {
  calculateCycleDay,
  calculateNextPeriod,
  getDaysUntil,
  getCyclePhase,
} from '@/lib/storage';


const Index = () => {
  const [settings, setSettings] = useState<CycleSettings>(getSettings());
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  useEffect(() => {
    const storedSettings = getSettings();
    setSettings(storedSettings);
  }, []);
  const cycleDay = settings.lastPeriodStart
  ? calculateCycleDay(settings.lastPeriodStart)
  : null;

const nextPeriod = settings.lastPeriodStart
  ? calculateNextPeriod(
      settings.lastPeriodStart,
      settings.averageCycleLength
    )
  : null;

const daysUntil = nextPeriod ? getDaysUntil(nextPeriod) : null;

const phase =
  cycleDay !== null
    ? getCyclePhase(cycleDay, settings.averageCycleLength)
    : null;

const progress =
  cycleDay !== null
    ? (cycleDay / settings.averageCycleLength) * 100
    : 0;


  const handleSaveSettings = (newSettings: CycleSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleLogSaved = () => {
    setHistoryRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Header />
        
        <main className="space-y-6">
          {/* Cycle Status - Main display */}
          <CycleStatus
            cycleDay={cycleDay}
            phase={phase}
            nextPeriod={nextPeriod}
            daysUntil={daysUntil}
            progress={progress}
          />

          
          {/* Calendar View */}
          <CalendarView settings={settings} />
          
          {/* Three column layout on larger screens */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cycle Settings */}
            <CycleInput settings={settings} onSave={handleSaveSettings} />
            
            {/* Flow Tracking */}
            <FlowTracking onFlowSaved={handleLogSaved} />
          </div>
          
          {/* Daily Log */}
          <DailyLog onLogSaved={handleLogSaved} />
          
          {/* History */}
          <HistoryView refreshKey={historyRefreshKey} />
        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Your data stays private on this device
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
