import { motion } from 'framer-motion';
import { Flame, Grid3X3, AlertTriangle } from 'lucide-react';
import { ViewMode } from '@/types/event';

interface BottomModeSwitcherProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  { value: 'heat', label: 'Heat Mode', icon: <Flame className="w-4 h-4" /> },
  { value: 'category', label: 'Category Mode', icon: <Grid3X3 className="w-4 h-4" /> },
  { value: 'risk', label: 'Risk Mode', icon: <AlertTriangle className="w-4 h-4" /> },
];

export const BottomModeSwitcher = ({ currentMode, onModeChange }: BottomModeSwitcherProps) => {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="glass-panel p-1.5 flex gap-1">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentMode === mode.value
                ? 'bg-primary text-primary-foreground shadow-glow-cyan'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {mode.icon}
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
