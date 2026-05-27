import type { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are an energy market analyst. Given a news article title and description, write a 2-sentence summary highlighting the key market impact. Be concise and professional.`;

export async function GET(request: NextRequest) {
  const gnewsToken = process.env.GNEWS_API_KEY;
  if (!gnewsToken) {
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
  url.searchParams.set('token', gnewsToken);

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

  const groqKey = process.env.GROQ_API_KEY;

  const summarized = await Promise.all(
    articles.map(async (article: any) => {
      if (!groqKey) return article;

      try {
        const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 150,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `Title: ${article.title}\nDescription: ${article.description || ''}` },
            ],
          }),
        });

        if (!aiRes.ok) return article;

        const aiData = await aiRes.json();

        const summary = aiData?.choices?.[0]?.message?.content || aiData?.choices?.[0]?.text || article.description || article.title || '';

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
