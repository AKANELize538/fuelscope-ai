'use client';

type Stock = {
  name: string;
  ticker: string;
  price: number;
  change: number;
};

const stocks: Stock[] = [
  { name: 'ExxonMobil', ticker: 'XOM', price: 111.23, change: 1.24 },
  { name: 'Chevron', ticker: 'CVX', price: 165.4, change: -0.82 },
  { name: 'Shell', ticker: 'SHEL', price: 48.7, change: 0.56 },
];

export default function StockCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stocks.map((s) => {
        const positive = s.change >= 0;
        return (
          <div key={s.ticker} className="rounded-[18px] bg-[#2a2a2c] border border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold text-[#cccccc] uppercase tracking-[0.5px]">{s.ticker}</p>
                <p className="mt-1 text-[17px] font-semibold text-white tracking-[-0.374px]">{s.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[24px] font-semibold text-white tracking-[-0.374px]">${s.price.toFixed(2)}</p>
                <p className={`mt-1 text-[14px] font-semibold ${positive ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                  {positive ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
