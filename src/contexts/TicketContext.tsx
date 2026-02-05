import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Ticket, TicketStatus } from '@/types/ticket';
import { PrioritizedAction } from '@/types/prioritization';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  moveTicket: (id: string, newStatus: TicketStatus) => void;
  convertActionToTicket: (action: PrioritizedAction) => Ticket;
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const generateId = () => `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...ticketData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setTickets((prev) => [...prev, newTicket]);
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  }, []);

  const deleteTicket = useCallback((id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  }, []);

  const moveTicket = useCallback((id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  }, []);

  const convertActionToTicket = useCallback((action: PrioritizedAction): Ticket => {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: generateId(),
      title: action.title,
      description: action.explanation,
      priorityScore: action.priorityScore,
      impactScore: action.impactScore,
      riskScore: action.riskScore,
      difficultyScore: action.difficultyScore,
      costScore: action.costScore,
      relevanceScore: action.relevanceScore,
      actionType: action.actionType,
      tags: [action.actionType],
      dueDate: null,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
      sourceActionId: action.id,
    };
    setTickets((prev) => [...prev, ticket]);
    return ticket;
  }, []);

  const getTicketsByStatus = useCallback(
    (status: TicketStatus) => tickets.filter((ticket) => ticket.status === status),
    [tickets]
  );

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        moveTicket,
        convertActionToTicket,
        getTicketsByStatus,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
