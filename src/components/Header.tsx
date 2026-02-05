import { Globe, Search, Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  domain: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export const Header = ({ domain, searchQuery, onSearchChange, onReset }: HeaderProps) => {
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

      {/* Domain Badge + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-xs text-muted-foreground">Domain:</span>
          <span className="text-sm font-medium text-primary">{domain}</span>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            className="pl-10 h-10 bg-muted/30 border-border/50 focus:border-primary"
          />
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
