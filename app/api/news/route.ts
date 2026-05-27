import type { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are an energy market analyst. Given a news article title and description, write a 2-sentence AI summary that highlights the key market impact. Be concise and professional.`;

export async function GET(request: NextRequest) {
  const token = process.env.GNEWS_API_KEY;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing GNEWS_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL('https://gnews.io/api/v4/search');
  url.searchParams.set('q', 'gas prices OR crude oil OR energy market');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('country', 'us');
  url.searchParams.set('max', '6');
  url.searchParams.set('token', token);

  const response = await fetch(url.toString(), { next: { revalidate: 600 } });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: errorText || 'GNews fetch failed' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();
  const articles = data.articles || [];

  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const summarized = await Promise.all(
    articles.map(async (article: any) => {
      if (!anthropicKey) return article;

      try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 150,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: `Title: ${article.title}\nDescription: ${article.description || ''}`,
              },
            ],
          }),
        });

        if (!aiRes.ok) {
          return article;
        }

        const aiData = await aiRes.json();

        // Try a few common fields for the returned text
        const summary =
          aiData?.content?.[0]?.text || aiData?.completion?.text || aiData?.completion || aiData?.text || article.description || article.title || '';

        return { ...article, description: summary };
      } catch (err) {
        return article;
      }
    })
  );

  return new Response(JSON.stringify({ articles: summarized }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
