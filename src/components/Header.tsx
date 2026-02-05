import { Globe, Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  domain: string;
  onReset: () => void;
}

export const Header = ({ domain, onReset }: HeaderProps) => {
  return (
    <header className="h-16 glass-panel rounded-none border-x-0 border-t-0 flex items-center justify-between px-6 z-50">
      {/* Logo */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Globe className="w-7 h-7 text-primary" />
        <span className="font-semibold text-lg gradient-text hidden sm:inline">Opportunity Radar</span>
      </button>

      {/* Domain Badge */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-xs text-muted-foreground">Domain:</span>
          <span className="text-sm font-medium text-primary">{domain}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Filter className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
