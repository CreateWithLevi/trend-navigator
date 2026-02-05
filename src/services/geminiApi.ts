import { GlobalEvent } from '@/types/event';
import { PrioritizedAction, ActionType } from '@/types/prioritization';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

function isValidActionType(type: string): type is ActionType {
  return ['integration', 'feature', 'partnership', 'event', 'monitoring', 'optimization', 'expansion'].includes(type);
}

function validateAndTransformResponse(rawActions: unknown[]): PrioritizedAction[] {
  return rawActions.map((action: unknown, index: number) => {
    const a = action as Record<string, unknown>;
    return {
      id: (a.id as string) || `gemini-action-${Date.now()}-${index}`,
      title: (a.title as string) || 'Untitled Action',
      explanation: (a.explanation as string) || '',
      priorityScore: Math.min(100, Math.max(0, Number(a.priorityScore) || 50)),
      riskScore: Math.min(100, Math.max(0, Number(a.riskScore) || 50)),
      difficultyScore: Math.min(100, Math.max(0, Number(a.difficultyScore) || 50)),
      costScore: Math.min(100, Math.max(0, Number(a.costScore) || 50)),
      impactScore: Math.min(100, Math.max(0, Number(a.impactScore) || 50)),
      relevanceScore: Math.min(100, Math.max(0, Number(a.relevanceScore) || 50)),
      recommendedSteps: Array.isArray(a.recommendedSteps)
        ? (a.recommendedSteps as string[]).filter(s => typeof s === 'string')
        : [],
      sourceEventIds: Array.isArray(a.sourceEventIds)
        ? (a.sourceEventIds as string[]).filter(s => typeof s === 'string')
        : [],
      actionType: isValidActionType(a.actionType as string)
        ? (a.actionType as ActionType)
        : 'monitoring',
    };
  });
}

function buildPrompt(events: GlobalEvent[], domain: string, maxActions: number): string {
  const simplifiedEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    summary: e.summary,
    category: e.category,
    heat: e.heat,
    relevanceToUserDomain: e.relevanceToUserDomain,
    related: e.related.map(r => `${r.name} (${r.type})`).join(', '),
    impact: e.impact.map(i => `${i.area}: ${i.level}`).join(', '),
  }));

  return `You are a strategic business analyst helping a company in the "${domain}" industry identify actionable opportunities based on global market events.

## Context
The user operates in the "${domain}" space. Analyze the following market events and generate ${maxActions} prioritized strategic actions.

## Events Data
${JSON.stringify(simplifiedEvents, null, 2)}

## Scoring Guidelines
For each action, provide scores from 0-100:
- priorityScore: Overall priority (calculated from other scores, higher = more urgent)
- impactScore: Potential business impact (higher = more impactful)
- riskScore: Associated risk level (higher = riskier, but may indicate opportunity)
- relevanceScore: How relevant to "${domain}" (higher = more relevant)
- difficultyScore: Implementation difficulty (higher = more difficult)
- costScore: Resource/cost requirements (higher = more expensive)

## Action Types
Choose from: integration, feature, partnership, event, monitoring, optimization, expansion

## Required Output Format
Return a JSON array of ${maxActions} actions. Each action must have this exact structure:
{
  "id": "unique-string-id",
  "title": "Concise action title (max 80 chars)",
  "explanation": "2-3 sentence explanation of why this action matters and its strategic value",
  "priorityScore": number,
  "riskScore": number,
  "difficultyScore": number,
  "costScore": number,
  "impactScore": number,
  "relevanceScore": number,
  "recommendedSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "sourceEventIds": ["event-id-1"],
  "actionType": "one-of-the-action-types"
}

IMPORTANT: Return ONLY the JSON array, no markdown formatting, no additional text. Sort by priorityScore descending.`;
}

export async function generatePrioritizedActionsWithGemini(
  events: GlobalEvent[],
  domain: string,
  maxActions: number = 8
): Promise<PrioritizedAction[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  const prompt = buildPrompt(events, domain, maxActions);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error('No response content from Gemini');
  }

  let parsedActions: unknown[];
  try {
    parsedActions = JSON.parse(textContent);
    if (!Array.isArray(parsedActions)) {
      throw new Error('Response is not an array');
    }
  } catch (e) {
    throw new Error(`Failed to parse Gemini response as JSON: ${e}`);
  }

  return validateAndTransformResponse(parsedActions);
}
