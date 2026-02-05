import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Ticket, TICKET_STATUS_CONFIG } from '@/types/ticket';
import { ACTION_TYPE_CONFIG } from '@/types/prioritization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

export const TicketCard = ({ ticket, onEdit, onDelete }: TicketCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = ACTION_TYPE_CONFIG[ticket.actionType];

  const getPriorityGlow = (score: number) => {
    if (score >= 80) return 'shadow-[0_0_15px_hsl(145_70%_50%/0.4)]';
    if (score >= 60) return 'shadow-[0_0_15px_hsl(185_100%_50%/0.4)]';
    if (score >= 40) return 'shadow-[0_0_15px_hsl(35_90%_55%/0.4)]';
    return 'shadow-[0_0_15px_hsl(0_75%_55%/0.4)]';
  };

  const getPriorityBorder = (score: number) => {
    if (score >= 80) return 'border-[hsl(145_70%_50%/0.5)]';
    if (score >= 60) return 'border-[hsl(185_100%_50%/0.5)]';
    if (score >= 40) return 'border-[hsl(35_90%_55%/0.5)]';
    return 'border-[hsl(0_75%_55%/0.5)]';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-card/80 backdrop-blur-xl border rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200',
        getPriorityBorder(ticket.priorityScore),
        isDragging ? 'opacity-50 scale-105 z-50' : 'hover:scale-[1.02]',
        !isDragging && getPriorityGlow(ticket.priorityScore)
      )}
      whileHover={{ y: -2 }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge
            className="text-xs"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.label}
          </Badge>
          <span className="text-lg font-bold text-primary">{ticket.priorityScore}</span>
        </div>

        {/* Title */}
        <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
          {ticket.title}
        </h4>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ticket.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {ticket.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{ticket.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {ticket.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(ticket.dueDate)}
            </div>
          )}
          {!ticket.dueDate && <div />}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(ticket);
              }}
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ticket.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
