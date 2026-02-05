import { useMutation } from '@tanstack/react-query';
import { generatePrioritizedActionsWithGemini } from '@/services/geminiApi';
import { generatePrioritizedActions } from '@/utils/mockPrioritization';
import { PrioritizedAction } from '@/types/prioritization';
import { GlobalEvent } from '@/types/event';

interface UsePrioritizationOptions {
  onSuccess?: (actions: PrioritizedAction[]) => void;
  onError?: (error: Error) => void;
}

interface PrioritizationInput {
  events: GlobalEvent[];
  domain: string;
  maxActions?: number;
}

export function usePrioritization({ onSuccess, onError }: UsePrioritizationOptions = {}) {
  return useMutation({
    mutationKey: ['prioritization'],
    mutationFn: async ({ events, domain, maxActions = 8 }: PrioritizationInput): Promise<PrioritizedAction[]> => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        console.warn('VITE_GEMINI_API_KEY not configured, using mock data');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return generatePrioritizedActions(events, domain, maxActions);
      }

      try {
        return await generatePrioritizedActionsWithGemini(events, domain, maxActions);
      } catch (error) {
        console.error('Gemini API failed, falling back to mock:', error);
        return generatePrioritizedActions(events, domain, maxActions);
      }
    },
    onSuccess,
    onError,
  });
}
