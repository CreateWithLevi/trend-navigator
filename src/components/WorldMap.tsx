import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { GlobalEvent, ViewMode, CATEGORY_CONFIG } from '@/types/event';

interface WorldMapProps {
  events: GlobalEvent[];
  selectedEvent: GlobalEvent | null;
  onEventSelect: (event: GlobalEvent) => void;
  viewMode: ViewMode;
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const getMarkerColor = (event: GlobalEvent, viewMode: ViewMode): string => {
  if (viewMode === 'category') {
    return CATEGORY_CONFIG[event.category].color;
  }
  if (viewMode === 'risk') {
    // Risk mode: red for high impact, orange for medium, green for low
    const hasHighImpact = event.impact.some((i) => i.level === 'high');
    const hasMediumImpact = event.impact.some((i) => i.level === 'medium');
    if (hasHighImpact) return 'hsl(0, 75%, 55%)';
    if (hasMediumImpact) return 'hsl(35, 90%, 55%)';
    return 'hsl(145, 70%, 50%)';
  }
  // Heat mode: color based on heat level
  if (event.heat >= 80) return 'hsl(0, 75%, 55%)';
  if (event.heat >= 60) return 'hsl(35, 90%, 55%)';
  if (event.heat >= 40) return 'hsl(45, 90%, 55%)';
  return 'hsl(185, 100%, 50%)';
};

const getMarkerSize = (event: GlobalEvent): number => {
  // Size based on heat level (8-24px)
  return 8 + (event.heat / 100) * 16;
};

export const WorldMap = memo(({ events, selectedEvent, onEventSelect, viewMode }: WorldMapProps) => {
  const markers = useMemo(() => {
    return events.map((event) => ({
      ...event,
      color: getMarkerColor(event, viewMode),
      size: getMarkerSize(event),
    }));
  }, [events, viewMode]);

  return (
    <div className="w-full h-full bg-background relative overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
          center: [0, 30],
        }}
        className="w-full h-full"
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(215, 20%, 12%)"
                  stroke="hsl(215, 20%, 18%)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: 'hsl(215, 20%, 15%)', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            return (
              <Marker
                key={event.id}
                coordinates={[event.lng, event.lat]}
                onClick={() => onEventSelect(event)}
              >
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow */}
                  <motion.circle
                    r={event.size * 1.5}
                    fill={event.color}
                    opacity={0.2}
                    animate={
                      event.heat >= 70
                        ? {
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Main marker */}
                  <motion.circle
                    r={event.size}
                    fill={event.color}
                    opacity={0.8}
                    stroke={isSelected ? 'white' : event.color}
                    strokeWidth={isSelected ? 3 : 1}
                    whileHover={{ scale: 1.2 }}
                    animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: isSelected ? Infinity : 0,
                    }}
                  />
                  {/* Center dot */}
                  <circle r={event.size * 0.3} fill="white" opacity={0.9} />
                </motion.g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map legend */}
      <div className="absolute bottom-20 left-4 glass-panel p-3">
        <p className="text-xs font-medium text-foreground mb-2">
          {viewMode === 'heat' && 'Heat Level'}
          {viewMode === 'category' && 'Categories'}
          {viewMode === 'risk' && 'Risk Level'}
        </p>
        <div className="space-y-1.5">
          {viewMode === 'heat' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(0,75%,55%)]" />
                <span className="text-xs text-muted-foreground">High (80+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(35,90%,55%)]" />
                <span className="text-xs text-muted-foreground">Medium (60-79)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(185,100%,50%)]" />
                <span className="text-xs text-muted-foreground">Low (&lt;60)</span>
              </div>
            </>
          )}
          {viewMode === 'category' &&
            Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            ))}
          {viewMode === 'risk' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(0,75%,55%)]" />
                <span className="text-xs text-muted-foreground">High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(35,90%,55%)]" />
                <span className="text-xs text-muted-foreground">Medium Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(145,70%,50%)]" />
                <span className="text-xs text-muted-foreground">Low Impact</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

WorldMap.displayName = 'WorldMap';
