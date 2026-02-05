import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Target, AlertTriangle, Gauge, DollarSign, Link2 } from 'lucide-react';
import { Ticket, DEFAULT_TAGS, TicketStatus, TICKET_STATUS_CONFIG } from '@/types/ticket';
import { ACTION_TYPE_CONFIG, ActionType } from '@/types/prioritization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TicketEditModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
  mode: 'create' | 'edit';
}

export const TicketEditModal = ({
  ticket,
  isOpen,
  onClose,
  onSave,
  mode,
}: TicketEditModalProps) => {
  const [formData, setFormData] = useState<Ticket | null>(ticket);

  useEffect(() => {
    setFormData(ticket);
  }, [ticket]);

  if (!isOpen || !formData) return null;

  const handleChange = <K extends keyof Ticket>(key: K, value: Ticket[K]) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const toggleTag = (tag: string) => {
    if (!formData) return;
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    handleChange('tags', newTags);
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const scoreMetrics = [
    { key: 'impactScore' as const, label: 'Impact', icon: Target, description: 'Potential positive effect' },
    { key: 'riskScore' as const, label: 'Risk', icon: AlertTriangle, description: 'Risk addressed or mitigated' },
    { key: 'relevanceScore' as const, label: 'Relevance', icon: Link2, description: 'Alignment with domain' },
    { key: 'difficultyScore' as const, label: 'Difficulty', icon: Gauge, description: 'Execution complexity' },
    { key: 'costScore' as const, label: 'Cost', icon: DollarSign, description: 'Resource investment' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">
              {mode === 'create' ? 'Create Ticket' : 'Edit Ticket'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter ticket title"
                className="bg-muted/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter ticket description"
                className="bg-muted/50 min-h-[100px]"
              />
            </div>

            {/* Status & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TicketStatus) => handleChange('status', value)}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TICKET_STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span style={{ color: config.color }}>{config.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => handleChange('dueDate', e.target.value || null)}
                    className="bg-muted/50 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Priority Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Priority Score</Label>
                <span className="text-2xl font-bold text-primary">{formData.priorityScore}</span>
              </div>
              <Slider
                value={[formData.priorityScore]}
                onValueChange={([value]) => handleChange('priorityScore', value)}
                max={100}
                step={1}
                className="py-2"
              />
            </div>

            {/* Score Metrics */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Score Metrics
              </Label>
              <div className="grid gap-4">
                {scoreMetrics.map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{label}</span>
                        <span className="text-xs text-muted-foreground">({description})</span>
                      </div>
                      <span className="font-medium">{formData[key]}</span>
                    </div>
                    <Slider
                      value={[formData[key]]}
                      onValueChange={([value]) => handleChange(key, value)}
                      max={100}
                      step={1}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {mode === 'create' ? 'Create Ticket' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
