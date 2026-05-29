'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
};

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        const articles = Array.isArray(data.articles) ? data.articles : [];
        setNewsItems(articles.map((a: any) => ({
          title: a.title || 'Untitled',
          source: a.source?.name || a.source || 'GNews',
          publishedAt: new Date(a.publishedAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          }),
          description: a.description || 'No summary available.',
          url: a.url || '#',
        })));
      })
      .catch(() => setNewsItems([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-[18px] bg-white border border-[#e0e0e0] p-6 animate-pulse">
            <div className="h-4 bg-[#f0f0f0] rounded w-3/4 mb-3" />
            <div className="h-3 bg-[#f0f0f0] rounded w-1/2 mb-4" />
            <div className="h-3 bg-[#f0f0f0] rounded w-full mb-2" />
            <div className="h-3 bg-[#f0f0f0] rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="rounded-[18px] bg-white border border-[#e0e0e0] p-6 text-center text-[#7a7a7a]">
        No news available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsItems.map((item, i) => (
        <div key={i} className="rounded-[18px] bg-white border border-[#e0e0e0] p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-[0.5px]">{item.source}</span>
            <span className="text-[12px] text-[#7a7a7a]">· {item.publishedAt}</span>
          </div>
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">{item.title}</h3>
          <p className="text-[15px] text-[#7a7a7a] leading-[1.47] mb-4">{item.description}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="text-[14px] font-semibold text-[#0066cc]">
            Read more →
          </a>
        </div>
      ))}
    </div>
  );
}
