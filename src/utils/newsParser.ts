import { GlobalEvent, EventCategory } from '@/types/event';
import { ParsedNewsItem } from '@/services/newsApi';

export function parseNewsResponse(responseString: string): ParsedNewsItem[] {
  const docRegex = /<doc>([\s\S]*?)<\/doc>/g;
  const items: ParsedNewsItem[] = [];

  let match;
  while ((match = docRegex.exec(responseString)) !== null) {
    const docContent = match[1];
    const parsed = parseDocContent(docContent);
    if (parsed) {
      items.push(parsed);
    }
  }

  return items;
}

function parseDocContent(content: string): ParsedNewsItem | null {
  const getField = (fieldName: string): string => {
    const regex = new RegExp(`${fieldName}:\\s*(.+?)(?=\\n[A-Z]|\\n\\n|$)`, 's');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const citationKeyMatch = content.match(/Citation key:\s*\[(\d+)\]/);
  const titleMatch = content.match(/Title:\s*(.+?)(?=\n\n|\nSummary:)/s);
  const summaryMatch = content.match(/Summary:\s*([\s\S]+?)(?=\nPublished date:)/);

  const citationKey = citationKeyMatch ? citationKeyMatch[1] : '';
  const title = titleMatch ? titleMatch[1].trim() : '';
  const summary = summaryMatch ? summaryMatch[1].trim() : '';

  if (!title) return null;

  const publishedDate = getField('Published date');
  const source = getField('Source');
  const classification = getField('Classification');
  const sentimentRaw = getField('Sentiment').toLowerCase();
  const reportingVoice = getField('Reporting voice');
  const continent = getField('Continent');

  const sentiment: 'positive' | 'negative' | 'neutral' =
    sentimentRaw === 'positive' ? 'positive' :
    sentimentRaw === 'negative' ? 'negative' : 'neutral';

  return {
    citationKey,
    title,
    summary,
    publishedDate,
    source,
    classification,
    sentiment,
    reportingVoice,
    continent,
  };
}

function mapClassificationToCategory(classification: string): EventCategory {
  const lowerClassification = classification.toLowerCase();

  if (lowerClassification.includes('technology') || lowerClassification.includes('tech')) {
    return 'tool';
  }
  if (lowerClassification.includes('market') || lowerClassification.includes('finance') || lowerClassification.includes('business')) {
    return 'market';
  }
  if (lowerClassification.includes('competition') || lowerClassification.includes('competitor')) {
    return 'competitor';
  }
  if (lowerClassification.includes('api') || lowerClassification.includes('developer')) {
    return 'api';
  }
  if (lowerClassification.includes('user') || lowerClassification.includes('feedback') || lowerClassification.includes('pain')) {
    return 'pain';
  }

  return 'trend';
}

function getContinentCoordinates(continent: string): { lat: number; lng: number } {
  const coords: Record<string, { lat: number; lng: number }> = {
    'north america': { lat: 39.8283, lng: -98.5795 },
    'south america': { lat: -8.7832, lng: -55.4915 },
    'europe': { lat: 51.1657, lng: 10.4515 },
    'asia': { lat: 34.0479, lng: 100.6197 },
    'africa': { lat: -8.7832, lng: 34.5085 },
    'oceania': { lat: -25.2744, lng: 133.7751 },
    'australia': { lat: -25.2744, lng: 133.7751 },
  };

  const normalizedContinent = continent.toLowerCase().trim();
  return coords[normalizedContinent] || { lat: 0, lng: 0 };
}

export function transformToGlobalEvents(
  items: ParsedNewsItem[],
  userDomain: string
): GlobalEvent[] {
  return items.map((item, index) => {
    const baseCoords = getContinentCoordinates(item.continent);
    const category = mapClassificationToCategory(item.classification);

    // Add jitter to spread markers on map
    const lat = baseCoords.lat + (Math.random() - 0.5) * 15;
    const lng = baseCoords.lng + (Math.random() - 0.5) * 30;

    // Calculate heat based on sentiment
    const baseHeat =
      item.sentiment === 'negative' ? 85 :
      item.sentiment === 'positive' ? 75 : 65;
    const heat = baseHeat + Math.floor(Math.random() * 15);

    return {
      id: `news-${item.citationKey || index}`,
      title: item.title,
      summary: item.summary,
      lat,
      lng,
      category,
      heat,
      metrics: {
        news: 70 + Math.floor(Math.random() * 30),
        reddit: Math.floor(Math.random() * 60),
        twitter: Math.floor(Math.random() * 60),
        googleTrend: Math.floor(Math.random() * 70),
      },
      timeline: [
        {
          date: item.publishedDate || new Date().toISOString(),
          title: 'Published',
          description: `Source: ${item.source}`,
        },
      ],
      related: [
        {
          name: item.source || 'Unknown Source',
          type: 'organization' as const,
        },
      ],
      impact: [
        {
          area: 'Market Relevance',
          level: item.sentiment === 'negative' ? 'high' : 'medium',
          description: `${item.reportingVoice || 'News'} coverage from ${item.continent || 'Unknown region'}`,
        },
      ],
      relevanceToUserDomain: 70 + Math.floor(Math.random() * 25),
      domain: userDomain,
    };
  });
}
