import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/contexts/TicketContext';
import { Ticket, TicketStatus } from '@/types/ticket';
import { ColumnContainer } from './ColumnContainer';
import { TicketCard } from './TicketCard';
import { TicketEditModal } from './TicketEditModal';
import { Button } from '@/components/ui/button';

const COLUMNS: TicketStatus[] = ['todo', 'in-progress', 'done'];

export const ActionBoardScreen = () => {
  const navigate = useNavigate();
  const { tickets, updateTicket, deleteTicket, moveTicket } = useTickets();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<TicketStatus, Ticket[]> = {
      'todo': [],
      'in-progress': [],
      'done': [],
    };
    tickets.forEach((ticket) => {
      grouped[ticket.status].push(ticket);
    });
    // Sort by priority score within each column
    Object.keys(grouped).forEach((status) => {
      grouped[status as TicketStatus].sort((a, b) => b.priorityScore - a.priorityScore);
    });
    return grouped;
  }, [tickets]);

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id);
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column
    if (COLUMNS.includes(overId as TicketStatus)) {
      const newStatus = overId as TicketStatus;
      const ticket = tickets.find((t) => t.id === activeId);
      if (ticket && ticket.status !== newStatus) {
        moveTicket(activeId, newStatus);
      }
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleSaveTicket = (updatedTicket: Ticket) => {
    updateTicket(updatedTicket.id, updatedTicket);
  };

  const handleDeleteTicket = (id: string) => {
    deleteTicket(id);
  };

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <header className="glass-panel border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Action Board</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track your prioritized actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {tickets.length} total tickets
            </span>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 p-6 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-6 h-full">
            {COLUMNS.map((status) => (
              <ColumnContainer
                key={status}
                status={status}
                tickets={ticketsByStatus[status]}
                onEditTicket={handleEditTicket}
                onDeleteTicket={handleDeleteTicket}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTicket && (
              <div className="rotate-3 scale-105">
                <TicketCard
                  ticket={activeTicket}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Edit Modal */}
      <TicketEditModal
        ticket={editingTicket}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={handleSaveTicket}
        mode="edit"
      />
    </motion.div>
  );
};
