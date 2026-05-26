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

export default function StockCards() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-white">Energy Stocks</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.map((s) => {
          const positive = s.change >= 0;
          const changeClass = positive ? 'text-emerald-400' : 'text-rose-400';

          return (
            <div
              key={s.ticker}
              className="rounded-xl bg-zinc-900 border border-zinc-800 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-400">{s.ticker}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold text-white">${s.price.toFixed(2)}</div>
                  <div className={`mt-1 text-sm ${changeClass}`}>{positive ? '+' : ''}{s.change.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
