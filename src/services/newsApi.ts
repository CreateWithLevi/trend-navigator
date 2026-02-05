export interface NewsApiRequest {
  query: string;
}

export interface NewsApiResponse {
  as_dicts: null;
  as_string: string;
}

export interface ParsedNewsItem {
  citationKey: string;
  title: string;
  summary: string;
  publishedDate: string;
  source: string;
  classification: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reportingVoice: string;
  continent: string;
}

const NEWS_API_ENDPOINT = 'https://cloud.activepieces.com/api/v1/webhooks/oL42YfxWidIQ8tzHyh7nP/sync';

export async function fetchNewsResults(query: string): Promise<NewsApiResponse> {
  const response = await fetch(NEWS_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`);
  }

  return response.json();
}
