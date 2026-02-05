import { useMutation } from '@tanstack/react-query';
import { fetchNewsResults } from '@/services/newsApi';
import { parseNewsResponse, transformToGlobalEvents } from '@/utils/newsParser';
import { GlobalEvent } from '@/types/event';

interface UseNewsSearchOptions {
  userDomain: string;
  onSuccess?: (events: GlobalEvent[]) => void;
  onError?: (error: Error) => void;
}

export function useNewsSearch({ userDomain, onSuccess, onError }: UseNewsSearchOptions) {
  return useMutation({
    mutationKey: ['newsSearch'],
    mutationFn: async (query: string): Promise<GlobalEvent[]> => {
      if (!query.trim()) {
        return [];
      }

      const response = await fetchNewsResults(query);
      const parsed = parseNewsResponse(response.as_string);
      return transformToGlobalEvents(parsed, userDomain);
    },
    onSuccess,
    onError,
  });
}
