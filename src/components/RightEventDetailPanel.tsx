import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  MessageSquare,
  Hash,
  Search,
  Calendar,
  Building,
  MapPin,
  User,
  Cpu,
  FileText,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlobalEvent, CATEGORY_CONFIG } from '@/types/event';

interface RightEventDetailPanelProps {
  event: GlobalEvent | null;
  onClose: () => void;
}

const entityIcons = {
  organization: Building,
  location: MapPin,
  person: User,
  technology: Cpu,
};

const impactColors = {
  low: 'bg-category-market/20 text-category-market',
  medium: 'bg-category-competitor/20 text-category-competitor',
  high: 'bg-destructive/20 text-destructive',
};

export const RightEventDetailPanel = ({ event, onClose }: RightEventDetailPanelProps) => {
  if (!event) return null;

  const config = CATEGORY_CONFIG[event.category];
  const combinedHeat = Math.round(
    (event.metrics.news + event.metrics.reddit + event.metrics.twitter + event.metrics.googleTrend) / 4
  );

  return (
    <AnimatePresence>
      <motion.aside
        className="w-96 glass-panel rounded-none border-y-0 border-r-0 h-full flex flex-col"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Badge
                className="mb-2"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                {config.label}
              </Badge>
              <h2 className="text-lg font-semibold text-foreground leading-tight">{event.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Summary */}
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">{event.summary}</p>
            </div>

            {/* Heat Metrics */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Heat Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'News', value: event.metrics.news, icon: FileText },
                  { label: 'Reddit', value: event.metrics.reddit, icon: MessageSquare },
                  { label: 'X/Twitter', value: event.metrics.twitter, icon: Hash },
                  { label: 'Google Trend', value: event.metrics.googleTrend, icon: Search },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={value} className="h-1.5 flex-1" />
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Combined Heat Score */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Combined Heat Score</span>
                  <span className="text-2xl font-bold gradient-text">{event.heat}</span>
                </div>
                <Progress value={event.heat} className="h-2" />
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Timeline */}
            {event.timeline.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  {event.timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {index < event.timeline.length - 1 && (
                          <div className="w-px h-full bg-border/50 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-border/50" />

            {/* Related Entities */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Related</h3>
              <div className="flex flex-wrap gap-2">
                {event.related.map((entity, index) => {
                  const Icon = entityIcons[entity.type];
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-muted/50"
                    >
                      <Icon className="w-3 h-3" />
                      {entity.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Impact Assessment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Impact Assessment</h3>
              <div className="space-y-2">
                {event.impact.map((item, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{item.area}</span>
                      <Badge className={impactColors[item.level]} variant="secondary">
                        {item.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevance Score */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Relevance to Your Domain</span>
                <span className="text-lg font-semibold text-primary">{event.relevanceToUserDomain}%</span>
              </div>
              <Progress value={event.relevanceToUserDomain} className="h-1.5" />
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 border-t border-border/50 flex gap-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-border/50">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="border-border/50">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
