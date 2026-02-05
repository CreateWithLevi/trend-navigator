import { GlobalEvent } from '@/types/event';
import { PrioritizedAction, ActionType } from '@/types/prioritization';

const actionTemplates: Array<{
  titleTemplate: string;
  explanationTemplate: string;
  actionType: ActionType;
  stepsTemplate: string[];
}> = [
  {
    titleTemplate: 'Integrate {technology} into your product',
    explanationTemplate: 'Based on {eventTitle}, integrating {technology} could significantly enhance your product capabilities and capture market demand.',
    actionType: 'integration',
    stepsTemplate: [
      'Review {technology} documentation and API specs',
      'Prototype integration in development environment',
      'Test with subset of users',
      'Plan phased rollout',
    ],
  },
  {
    titleTemplate: 'Attend {event} for networking',
    explanationTemplate: 'The activity around {location} suggests key industry players are gathering. Attending could yield valuable partnerships.',
    actionType: 'event',
    stepsTemplate: [
      'Register for the event',
      'Prepare pitch deck and demos',
      'Schedule meetings with target partners',
      'Follow up within 48 hours post-event',
    ],
  },
  {
    titleTemplate: 'Add {feature} to address user pain points',
    explanationTemplate: 'User feedback from {location} reveals demand for {feature}. Addressing this could reduce churn and improve retention.',
    actionType: 'feature',
    stepsTemplate: [
      'Conduct user interviews to validate need',
      'Design solution with UX team',
      'Build MVP version',
      'A/B test with control group',
    ],
  },
  {
    titleTemplate: 'Partner with {organization}',
    explanationTemplate: 'The competitive moves by {organization} present an opportunity for strategic partnership rather than competition.',
    actionType: 'partnership',
    stepsTemplate: [
      'Research partnership opportunities',
      'Prepare partnership proposal',
      'Reach out to key decision makers',
      'Negotiate terms and scope',
    ],
  },
  {
    titleTemplate: 'Monitor regulatory changes in {region}',
    explanationTemplate: 'Recent developments in {region} indicate regulatory shifts. Proactive monitoring will ensure compliance and first-mover advantage.',
    actionType: 'monitoring',
    stepsTemplate: [
      'Set up regulatory news alerts',
      'Engage local legal counsel',
      'Document current compliance status',
      'Prepare contingency plans',
    ],
  },
  {
    titleTemplate: 'Optimize {area} for better performance',
    explanationTemplate: 'Market data suggests {area} optimization could significantly improve user experience and operational efficiency.',
    actionType: 'optimization',
    stepsTemplate: [
      'Audit current {area} metrics',
      'Identify bottlenecks',
      'Implement improvements',
      'Measure and iterate',
    ],
  },
  {
    titleTemplate: 'Expand to {market} market',
    explanationTemplate: 'Growing activity in {market} indicates untapped opportunity. Early entry could establish market leadership.',
    actionType: 'expansion',
    stepsTemplate: [
      'Research {market} market requirements',
      'Adapt product for local needs',
      'Establish local partnerships',
      'Launch pilot program',
    ],
  },
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractEntities(event: GlobalEvent): { technology?: string; organization?: string; location?: string } {
  const technology = event.related.find((r) => r.type === 'technology')?.name;
  const organization = event.related.find((r) => r.type === 'organization')?.name;
  const location = event.related.find((r) => r.type === 'location')?.name;
  return { technology, organization, location };
}

function calculatePriorityScore(
  impact: number,
  risk: number,
  relevance: number,
  difficulty: number,
  cost: number
): number {
  // Formula: Impact(40%) + Risk(20%) + Relevance(20%) - Difficulty(10%) - Cost(10%)
  const score =
    impact * 0.4 +
    risk * 0.2 +
    relevance * 0.2 +
    (100 - difficulty) * 0.1 +
    (100 - cost) * 0.1;
  return Math.round(Math.min(100, Math.max(0, score)));
}

function generateActionFromEvent(event: GlobalEvent, domain: string): PrioritizedAction {
  const template = getRandomElement(actionTemplates);
  const entities = extractEntities(event);

  // Generate scores with some randomness but influenced by event data
  const baseImpact = event.heat * 0.8 + Math.random() * 20;
  const baseRisk = Math.random() * 60 + 20;
  const baseRelevance = event.relevanceToUserDomain;
  const baseDifficulty = Math.random() * 50 + 25;
  const baseCost = Math.random() * 60 + 20;

  const impactScore = Math.round(Math.min(100, baseImpact));
  const riskScore = Math.round(baseRisk);
  const relevanceScore = Math.round(baseRelevance);
  const difficultyScore = Math.round(baseDifficulty);
  const costScore = Math.round(baseCost);

  const priorityScore = calculatePriorityScore(impactScore, riskScore, relevanceScore, difficultyScore, costScore);

  // Fill in template placeholders
  const replacements: Record<string, string> = {
    '{technology}': entities.technology || 'new technology',
    '{organization}': entities.organization || 'key player',
    '{location}': entities.location || 'the region',
    '{region}': entities.location || 'the region',
    '{market}': entities.location || 'emerging',
    '{event}': event.title,
    '{eventTitle}': event.title,
    '{feature}': getFeatureFromCategory(event.category),
    '{area}': getAreaFromCategory(event.category),
  };

  const fillTemplate = (str: string): string => {
    let result = str;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
  };

  return {
    id: `action-${event.id}-${Date.now()}`,
    title: fillTemplate(template.titleTemplate),
    explanation: fillTemplate(template.explanationTemplate),
    priorityScore,
    riskScore,
    difficultyScore,
    costScore,
    impactScore,
    relevanceScore,
    recommendedSteps: template.stepsTemplate.map(fillTemplate),
    sourceEventIds: [event.id],
    actionType: template.actionType,
  };
}

function getFeatureFromCategory(category: string): string {
  const features: Record<string, string> = {
    trend: 'trend tracking dashboard',
    tool: 'integrated tooling',
    api: 'API connectivity',
    competitor: 'competitive analysis',
    pain: 'improved UX flow',
    market: 'market analytics',
  };
  return features[category] || 'new feature';
}

function getAreaFromCategory(category: string): string {
  const areas: Record<string, string> = {
    trend: 'trend analysis',
    tool: 'tool integration',
    api: 'API performance',
    competitor: 'competitive positioning',
    pain: 'user experience',
    market: 'market response',
  };
  return areas[category] || 'operations';
}

export function generatePrioritizedActions(
  events: GlobalEvent[],
  domain: string,
  count: number = 8
): PrioritizedAction[] {
  // Generate actions from events
  const actions = events
    .slice(0, Math.min(events.length, count + 2))
    .map((event) => generateActionFromEvent(event, domain));

  // Sort by priority score
  actions.sort((a, b) => b.priorityScore - a.priorityScore);

  // Return top actions
  return actions.slice(0, count);
}

export function simulateAIDelay(): Promise<void> {
  // Simulate AI processing time (1-2 seconds)
  return new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
}
