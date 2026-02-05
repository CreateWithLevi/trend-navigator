import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { Header } from './Header';
import { LeftSidebarFilters } from './LeftSidebarFilters';
import { RightEventDetailPanel } from './RightEventDetailPanel';
import { BottomModeSwitcher } from './BottomModeSwitcher';
import { WorldMap } from './WorldMap';
import { PrioritizationPanel } from './PrioritizationPanel';
import { Button } from '@/components/ui/button';
import { GlobalEvent, FilterState, EventCategory, ViewMode, CATEGORY_CONFIG } from '@/types/event';
import { PrioritizedAction } from '@/types/prioritization';
import { useNewsSearch } from '@/hooks/useNewsSearch';
import { usePrioritization } from '@/hooks/usePrioritization';
import { toast } from 'sonner';

interface GlobalEventHeatmapScreenProps {
  domain: string;
  onReset: () => void;
}

const initialFilters: FilterState = {
  categories: Object.keys(CATEGORY_CONFIG) as EventCategory[],
  heatSource: 'combined',
  timeRange: '7d',
  region: 'global',
};

export const GlobalEventHeatmapScreen = ({ domain, onReset }: GlobalEventHeatmapScreenProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('heat');
  const [showPrioritization, setShowPrioritization] = useState(false);
  const [prioritizedActions, setPrioritizedActions] = useState<PrioritizedAction[]>([]);
  const [newsEvents, setNewsEvents] = useState<GlobalEvent[]>([]);

  const { mutate: searchNews, isPending: isSearching } = useNewsSearch({
    userDomain: domain,
    onSuccess: (events) => {
      setNewsEvents(events);
      if (events.length === 0) {
        toast.info('No results found for your domain');
      }
    },
    onError: (error) => {
      toast.error(`Search failed: ${error.message}`);
    },
  });

  const { mutate: generatePriorities, isPending: isGeneratingPriorities } = usePrioritization({
    onSuccess: (actions) => {
      setPrioritizedActions(actions);
      toast.success(`Generated ${actions.length} prioritized actions`);
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });

  // Search on mount with the domain
  useEffect(() => {
    searchNews(domain);
  }, [domain]);

  const allEvents = newsEvents;

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Filter by category
      if (!filters.categories.includes(event.category)) return false;
      return true;
    });
  }, [allEvents, filters]);

  const eventCounts = useMemo(() => {
    const counts: Record<EventCategory, number> = {
      trend: 0,
      tool: 0,
      api: 0,
      competitor: 0,
      pain: 0,
      market: 0,
    };
    allEvents.forEach((event) => {
      counts[event.category]++;
    });
    return counts;
  }, [allEvents]);

  const handleEventSelect = (event: GlobalEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  const handleGeneratePriorities = () => {
    setShowPrioritization(true);
    setPrioritizedActions([]);
    generatePriorities({
      events: filteredEvents,
      domain,
      maxActions: 8,
    });
  };

  const handleClosePrioritization = () => {
    setShowPrioritization(false);
  };

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header
        domain={domain}
        onReset={onReset}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <LeftSidebarFilters
          filters={filters}
          onFiltersChange={setFilters}
          eventCounts={eventCounts}
        />

        {/* Main Map Area */}
        <main className="flex-1 relative">
          <WorldMap
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
            viewMode={viewMode}
          />

          {/* Loading State */}
          {isSearching && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
              <div className="text-center max-w-md p-8">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold mb-2">Fetching News</h2>
                <p className="text-muted-foreground">
                  Searching for news related to "{domain}"...
                </p>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          <BottomModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-40">
            {/* Generate Priorities Button */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleGeneratePriorities}
                disabled={isGeneratingPriorities || filteredEvents.length === 0}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
              >
                {isGeneratingPriorities ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Prioritized Actions
                  </>
                )}
              </Button>
            </motion.div>

            {/* Event count badge */}
            <motion.div
              className="glass-panel px-4 py-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-primary">{filteredEvents.length}</span> events
              </span>
            </motion.div>
          </div>
        </main>

        {/* Right Detail Panel */}
        {selectedEvent && (
          <RightEventDetailPanel event={selectedEvent} onClose={handleCloseDetail} userDomain={domain} />
        )}
      </div>

      {/* Prioritization Panel */}
      <AnimatePresence>
        {showPrioritization && (
          <PrioritizationPanel
            actions={prioritizedActions}
            isLoading={isGeneratingPriorities}
            onClose={handleClosePrioritization}
            domain={domain}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
