import type { NextRequest } from 'next/server';

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

  const response = await fetch(url.toString(), {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: errorText || 'GNews fetch failed' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
