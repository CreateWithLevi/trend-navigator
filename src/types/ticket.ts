import { ActionType } from './prioritization';

export type TicketStatus = 'todo' | 'in-progress' | 'done';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priorityScore: number;
  impactScore: number;
  riskScore: number;
  difficultyScore: number;
  costScore: number;
  relevanceScore: number;
  actionType: ActionType;
  tags: string[];
  dueDate: string | null;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  sourceActionId?: string;
}

export interface TicketColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

export const TICKET_STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  'todo': { label: 'To-Do', color: 'hsl(185 100% 50%)' },
  'in-progress': { label: 'In Progress', color: 'hsl(35 90% 55%)' },
  'done': { label: 'Done', color: 'hsl(145 70% 50%)' },
};

export const DEFAULT_TAGS = [
  'integration',
  'feature',
  'partnership',
  'research',
  'marketing',
  'technical',
  'urgent',
  'low-effort',
];
