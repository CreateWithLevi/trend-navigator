import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  AlertTriangle,
  Gauge,
  DollarSign,
  Zap,
  Link2,
  Plug,
  Calendar,
  Eye,
  Globe,
  Handshake,
  LayoutGrid,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PrioritizedAction, ACTION_TYPE_CONFIG, ActionType } from '@/types/prioritization';
import { ConvertToTicketButton } from '@/components/tickets/ConvertToTicketButton';

interface PrioritizationPanelProps {
  actions: PrioritizedAction[];
  isLoading: boolean;
  onClose: () => void;
  domain: string;
}

const actionTypeIcons: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  integration: Plug,
  feature: Sparkles,
  partnership: Handshake,
  event: Calendar,
  monitoring: Eye,
  optimization: Zap,
  expansion: Globe,
};

const ActionCard = ({ action, rank }: { action: PrioritizedAction; rank: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = ACTION_TYPE_CONFIG[action.actionType];
  const Icon = actionTypeIcons[action.actionType];

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number, inverted: boolean = false) => {
    const effectiveScore = inverted ? 100 - score : score;
    if (effectiveScore >= 70) return 'bg-green-500';
    if (effectiveScore >= 50) return 'bg-yellow-500';
    if (effectiveScore >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
    >
      <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Rank Badge */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              {rank}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className="flex items-center gap-1"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </Badge>
                <span className={`text-lg font-bold ${getPriorityColor(action.priorityScore)}`}>
                  {action.priorityScore}
                </span>
              </div>
              <h3 className="font-semibold text-foreground leading-tight">{action.title}</h3>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">{action.explanation}</p>

          {/* Score Grid */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[
              { label: 'Impact', value: action.impactScore, icon: Target, inverted: false },
              { label: 'Risk', value: action.riskScore, icon: AlertTriangle, inverted: false },
              { label: 'Relevance', value: action.relevanceScore, icon: Link2, inverted: false },
              { label: 'Difficulty', value: action.difficultyScore, icon: Gauge, inverted: true },
              { label: 'Cost', value: action.costScore, icon: DollarSign, inverted: true },
            ].map(({ label, value, icon: ScoreIcon, inverted }) => (
              <div key={label} className="text-center">
                <ScoreIcon className="w-3.5 h-3.5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all ${getScoreBarColor(value, inverted)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <div className="text-xs font-medium mt-1">{value}</div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Recommended Steps
                  </h4>
                  <ol className="space-y-2">
                    {action.recommendedSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Convert to Ticket Button */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <ConvertToTicketButton action={action} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const PrioritizationPanel = ({
  actions,
  isLoading,
  onClose,
  domain,
}: PrioritizationPanelProps) => {
  const navigate = useNavigate();
  const hasTickets = actions.length > 0;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">AI Prioritization Engine</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended actions for <span className="text-primary font-medium">{domain}</span>{' '}
                based on market signals
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              High (70+)
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              Medium (50-69)
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              Low (30-49)
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Critical (&lt;30)
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
              <div className="text-center text-muted-foreground py-4">
                <Sparkles className="w-6 h-6 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-sm">Analyzing market signals and generating recommendations...</p>
              </div>
            </div>
          ) : actions.length > 0 ? (
            <div className="space-y-4">
              {actions.map((action, index) => (
                <ActionCard key={action.id} action={action} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Actions Generated</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to include more events on the map.
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Priority = Impact(40%) + Risk(20%) + Relevance(20%) - Difficulty(10%) - Cost(10%)
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  navigate('/action-board');
                }}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                View Action Board
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
