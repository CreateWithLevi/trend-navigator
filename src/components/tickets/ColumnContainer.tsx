import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Ticket, TicketStatus, TICKET_STATUS_CONFIG } from '@/types/ticket';
import { TicketCard } from './TicketCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ColumnContainerProps {
  status: TicketStatus;
  tickets: Ticket[];
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
}

export const ColumnContainer = ({
  status,
  tickets,
  onEditTicket,
  onDeleteTicket,
}: ColumnContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = TICKET_STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col h-full glass-panel p-4 transition-all duration-200',
        isOver && 'ring-2 ring-primary/50 bg-primary/5'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Tickets Area */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className="space-y-3 min-h-[200px] pr-2"
        >
          <SortableContext
            items={tickets.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={onEditTicket}
                onDelete={onDeleteTicket}
              />
            ))}
          </SortableContext>

          {tickets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm">
              <div
                className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center mb-2"
                style={{ borderColor: `${config.color}50` }}
              >
                <Plus className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <p>Drop tickets here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};
