import React from 'react';

type Stock = {
  name: string;
  ticker: string;
  price: number;
  change: number; // percent
};

const stocks: Stock[] = [
  { name: 'ExxonMobil', ticker: 'XOM', price: 111.23, change: 1.24 },
  { name: 'Chevron', ticker: 'CVX', price: 165.4, change: -0.82 },
  { name: 'Shell', ticker: 'SHEL', price: 48.7, change: 0.56 },
];

function ChangeBadge({ change }: { change: number }) {
  const positive = change >= 0;
  const bg = positive ? 'bg-red-50' : 'bg-green-50';
  const color = positive ? 'text-red-500' : 'text-green-500';
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold ${bg} ${color}`}>
      {positive ? (
        <span className="text-sm">▲</span>
      ) : (
        <span className="text-sm">▼</span>
      )}
      <span>{Math.abs(change).toFixed(2)}%</span>
    </div>
  );
}

function StockCard({ s }: { s: Stock }) {
  return (
    <div className="rounded-[18px] bg-white border border-[#e6e6e6] p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.5px] text-[#7a7a7a]">{s.ticker}</p>
          <p className="mt-1 text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">{s.name}</p>
        </div>

        <div className="text-right">
          <p className="text-[20px] font-semibold text-[#1d1d1f]">${s.price.toFixed(2)}</p>
          <div className="mt-2">
            <ChangeBadge change={s.change} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StockCards() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Market Movers</h2>
        <p className="text-sm text-[#7a7a7a]">Selected energy sector equities</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((s) => (
          <StockCard key={s.ticker} s={s} />
        ))}
      </div>
    </section>
  );
}
