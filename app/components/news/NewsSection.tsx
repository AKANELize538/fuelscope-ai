'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  source: string;
  date: string;
  summary: string;
  keyword: string;
  url: string;
};

const mockNewsItems: NewsItem[] = [
  {
    source: 'Reuters Energy',
    title: 'US East Coast Gas Prices Rise Ahead of Summer',
    date: 'May 26, 2026',
    summary: 'AI summary will appear here...',
    keyword: 'gas prices',
    url: 'https://reuters.com',
  },
  {
    source: 'Bloomberg Energy',
    title: 'Crude Oil Outlook Tightens as Energy Market Remains Volatile',
    date: 'May 25, 2026',
    summary: 'AI summary will appear here...',
    keyword: 'crude oil',
    url: 'https://bloomberg.com',
  },
  {
    source: 'OilPrice.com',
    title: 'Petroleum Demand Grows Along US East Coast Fuel Corridor',
    date: 'May 24, 2026',
    summary: 'AI summary will appear here...',
    keyword: 'US East Coast fuel',
    url: 'https://oilprice.com',
  },
  {
    source: 'GasBuddy',
    title: 'Energy Market Watch: Gas Prices and Fuel Trends for Drivers',
    date: 'May 23, 2026',
    summary: 'AI summary will appear here...',
    keyword: 'energy market',
    url: 'https://gasbuddy.com',
  },
];

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNewsItems);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNewsItems([...mockNewsItems]);
    }, 600000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Energy News</h2>
          <p className="max-w-2xl text-sm text-zinc-400">
            Fresh mock headlines with AI summary placeholders for future Groq integration.
          </p>
        </div>
        <div className="text-sm text-zinc-500">Auto-refresh every 10 minutes</div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {newsItems.map((item) => (
          <article
            key={`${item.source}-${item.date}-${item.title}`}
            className="rounded-xl bg-zinc-900 border border-zinc-800 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className="mt-2 text-sm text-zinc-400">
                  {item.source} · {item.date}
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
            <p className="mt-4 text-sm leading-7 text-zinc-300">{item.summary}</p>
            <div className="mt-4 rounded-2xl bg-zinc-950/70 px-4 py-3 text-sm text-zinc-400">
              AI summary placeholder — Groq integration coming later.
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
