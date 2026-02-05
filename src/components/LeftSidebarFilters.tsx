import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Wrench,
  Code,
  Users,
  AlertTriangle,
  BarChart3,
  Radio,
  Clock,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EventCategory, HeatSource, TimeRange, FilterState, CATEGORY_CONFIG } from '@/types/event';
import { useState } from 'react';

interface LeftSidebarFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  eventCounts: Record<EventCategory, number>;
}

const categoryIcons: Record<EventCategory, React.ReactNode> = {
  trend: <TrendingUp className="w-4 h-4" />,
  tool: <Wrench className="w-4 h-4" />,
  api: <Code className="w-4 h-4" />,
  competitor: <Users className="w-4 h-4" />,
  pain: <AlertTriangle className="w-4 h-4" />,
  market: <BarChart3 className="w-4 h-4" />,
};

const regions = [
  { value: 'global', label: 'Global' },
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'middle-east', label: 'Middle East' },
];

export const LeftSidebarFilters = ({
  filters,
  onFiltersChange,
  eventCounts,
}: LeftSidebarFiltersProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSourceOpen, setIsSourceOpen] = useState(true);

  const handleCategoryToggle = (category: EventCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleHeatSourceChange = (source: HeatSource) => {
    onFiltersChange({ ...filters, heatSource: source });
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    onFiltersChange({ ...filters, timeRange: range });
  };

  const handleRegionChange = (region: string) => {
    onFiltersChange({ ...filters, region });
  };

  return (
    <motion.aside
      className="w-72 glass-panel rounded-none border-y-0 border-l-0 h-full overflow-y-auto"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 space-y-6">
        {/* Categories */}
        <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              Event Categories
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isCategoryOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 space-y-2">
              {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map((category) => {
                const config = CATEGORY_CONFIG[category];
                const isChecked = filters.categories.includes(category);
                const count = eventCounts[category] || 0;

                return (
                  <motion.div
                    key={category}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isChecked ? 'bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={category}
                        checked={isChecked}
                        onCheckedChange={() => handleCategoryToggle(category)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor={category}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <span style={{ color: config.color }}>{categoryIcons[category]}</span>
                        <span className="text-foreground/80">{config.label}</span>
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Heat Source */}
        <Collapsible open={isSourceOpen} onOpenChange={setIsSourceOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-secondary" />
              Heat Source
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isSourceOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <RadioGroup
              value={filters.heatSource}
              onValueChange={(v) => handleHeatSourceChange(v as HeatSource)}
              className="mt-3 space-y-2"
            >
              {[
                { value: 'combined', label: 'Combined Score' },
                { value: 'news', label: 'News Volume' },
                { value: 'social', label: 'Social Volume' },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    filters.heatSource === option.value ? 'bg-muted/50' : 'hover:bg-muted/30'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Time Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Time Range
          </h3>
          <div className="flex gap-2">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all ${
                  filters.timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-category-market" />
            Region
          </h3>
          <Select value={filters.region} onValueChange={handleRegionChange}>
            <SelectTrigger className="bg-muted/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.aside>
  );
};
