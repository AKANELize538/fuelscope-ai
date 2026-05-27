'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
};

const fallbackNewsItems: NewsItem[] = [
  {
    source: 'Reuters Energy',
    title: 'US East Coast Gas Prices Rise Ahead of Summer',
    publishedAt: 'May 26, 2026',
    description: 'AI summary placeholder — real GNews data will appear here soon.',
    url: 'https://reuters.com',
  },
  {
    source: 'Bloomberg Energy',
    title: 'Crude Oil Outlook Tightens as Energy Market Remains Volatile',
    publishedAt: 'May 25, 2026',
    description: 'AI summary placeholder — real GNews data will appear here soon.',
    url: 'https://bloomberg.com',
  },
  {
    source: 'OilPrice.com',
    title: 'Petroleum Demand Grows Along US East Coast Fuel Corridor',
    publishedAt: 'May 24, 2026',
    description: 'AI summary placeholder — real GNews data will appear here soon.',
    url: 'https://oilprice.com',
  },
  {
    source: 'GasBuddy',
    title: 'Energy Market Watch: Gas Prices and Fuel Trends for Drivers',
    publishedAt: 'May 23, 2026',
    description: 'AI summary placeholder — real GNews data will appear here soon.',
    url: 'https://gasbuddy.com',
  },
];

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNewsItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Unable to load news');
      }

      const data = await response.json();
      const articles = Array.isArray(data.articles) ? data.articles : [];

      const mappedNews = articles.map((article: any) => ({
        title: article.title || 'Untitled',
        source: article.source?.name || article.source || 'GNews',
        publishedAt: new Date(article.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        description: article.description || article.content || 'No description available.',
        url: article.url || '#',
      })) as NewsItem[];

      setNewsItems(mappedNews.length > 0 ? mappedNews : fallbackNewsItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setNewsItems(fallbackNewsItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = window.setInterval(fetchNews, 600000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Energy News</h2>
          <p className="max-w-2xl text-sm text-zinc-400">
            Live GNews headlines for gas prices, crude oil, and the energy market.
          </p>
        </div>
        <div className="text-sm text-zinc-500">Auto-refresh every 10 minutes</div>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl bg-rose-950/80 border border-rose-800 p-4 text-sm text-rose-300">
          Error loading news: {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-4 rounded-2xl bg-zinc-950/70 p-4 text-sm text-zinc-400">
          Loading news...
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {newsItems.map((item) => (
          <article
            key={`${item.source}-${item.publishedAt}-${item.title}`}
            className="rounded-xl bg-zinc-900 border border-zinc-800 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className="mt-2 text-sm text-zinc-400">
                  {item.source} · {item.publishedAt}
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-amber-300 hover:text-amber-200"
              >
                Read source
              </a>
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
