export type EventCategory = 
  | 'trend' 
  | 'tool' 
  | 'api' 
  | 'competitor' 
  | 'pain' 
  | 'market';

export type TimeRange = '24h' | '7d' | '30d';

export type HeatSource = 'news' | 'social' | 'combined';

export type ViewMode = 'heat' | 'category' | 'risk';

export interface HeatMetrics {
  news: number;
  reddit: number;
  twitter: number;
  googleTrend: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface RelatedEntity {
  name: string;
  type: 'organization' | 'location' | 'person' | 'technology';
}

export interface ImpactAssessment {
  area: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}

export interface GlobalEvent {
  id: string;
  title: string;
  summary: string;
  lat: number;
  lng: number;
  category: EventCategory;
  heat: number;
  metrics: HeatMetrics;
  timeline: TimelineEvent[];
  related: RelatedEntity[];
  impact: ImpactAssessment[];
  relevanceToUserDomain: number;
  domain: string;
}

export interface FilterState {
  categories: EventCategory[];
  heatSource: HeatSource;
  timeRange: TimeRange;
  region: string;
}

export const CATEGORY_CONFIG: Record<EventCategory, { label: string; color: string; glowClass: string }> = {
  trend: { label: 'New Trends', color: 'hsl(185, 100%, 50%)', glowClass: 'glow-cyan' },
  tool: { label: 'New Tools', color: 'hsl(270, 80%, 60%)', glowClass: 'glow-purple' },
  api: { label: 'New APIs', color: 'hsl(220, 90%, 60%)', glowClass: 'glow-blue' },
  competitor: { label: 'Competitor Moves', color: 'hsl(35, 90%, 55%)', glowClass: 'glow-orange' },
  pain: { label: 'User Pain Points', color: 'hsl(340, 80%, 60%)', glowClass: 'glow-pink' },
  market: { label: 'Market Shifts', color: 'hsl(145, 70%, 50%)', glowClass: 'glow-green' },
};
