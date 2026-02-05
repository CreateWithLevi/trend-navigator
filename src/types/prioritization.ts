export interface PrioritizedAction {
  id: string;
  title: string;
  explanation: string;
  priorityScore: number;
  riskScore: number;
  difficultyScore: number;
  costScore: number;
  impactScore: number;
  relevanceScore: number;
  recommendedSteps: string[];
  sourceEventIds: string[];
  actionType: ActionType;
}

export type ActionType =
  | 'integration'
  | 'feature'
  | 'partnership'
  | 'event'
  | 'monitoring'
  | 'optimization'
  | 'expansion';

export const ACTION_TYPE_CONFIG: Record<ActionType, { label: string; color: string; icon: string }> = {
  integration: { label: 'Integration', color: 'hsl(220, 90%, 60%)', icon: 'Plug' },
  feature: { label: 'New Feature', color: 'hsl(270, 80%, 60%)', icon: 'Sparkles' },
  partnership: { label: 'Partnership', color: 'hsl(145, 70%, 50%)', icon: 'Handshake' },
  event: { label: 'Event', color: 'hsl(35, 90%, 55%)', icon: 'Calendar' },
  monitoring: { label: 'Monitoring', color: 'hsl(185, 100%, 50%)', icon: 'Eye' },
  optimization: { label: 'Optimization', color: 'hsl(340, 80%, 60%)', icon: 'Zap' },
  expansion: { label: 'Expansion', color: 'hsl(50, 90%, 50%)', icon: 'Globe' },
};
