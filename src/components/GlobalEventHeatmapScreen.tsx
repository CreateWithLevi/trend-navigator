import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { LeftSidebarFilters } from './LeftSidebarFilters';
import { RightEventDetailPanel } from './RightEventDetailPanel';
import { BottomModeSwitcher } from './BottomModeSwitcher';
import { WorldMap } from './WorldMap';
import { getEventsByDomain } from '@/data/mockEvents';
import { GlobalEvent, FilterState, EventCategory, ViewMode, CATEGORY_CONFIG } from '@/types/event';

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
  const [searchQuery, setSearchQuery] = useState('');

  const allEvents = useMemo(() => getEventsByDomain(domain), [domain]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Filter by category
      if (!filters.categories.includes(event.category)) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesSummary = event.summary.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary) return false;
      }

      return true;
    });
  }, [allEvents, filters, searchQuery]);

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

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header
        domain={domain}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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

          {/* Mode Switcher */}
          <BottomModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />

          {/* Event count badge */}
          <motion.div
            className="absolute top-4 right-4 glass-panel px-4 py-2 z-40"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-semibold text-primary">{filteredEvents.length}</span> events
            </span>
          </motion.div>
        </main>

        {/* Right Detail Panel */}
        {selectedEvent && (
          <RightEventDetailPanel event={selectedEvent} onClose={handleCloseDetail} userDomain={domain} />
        )}
      </div>
    </motion.div>
  );
};
