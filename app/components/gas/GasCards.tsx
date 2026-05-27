'use client';

interface GasPrice {
  region: string;
  gasoline: number;
  diesel: number;
  gasolineTrend: number;
  dieselTrend: number;
}

const mockGasPrices: GasPrice[] = [
  { region: 'New York', gasoline: 3.45, diesel: 3.72, gasolineTrend: 2.5, dieselTrend: 1.8 },
  { region: 'Boston', gasoline: 3.52, diesel: 3.78, gasolineTrend: -1.2, dieselTrend: 0.5 },
  { region: 'Philadelphia', gasoline: 3.38, diesel: 3.65, gasolineTrend: 3.1, dieselTrend: 2.2 },
];

function TrendIndicator({ trend }: { trend: number }) {
  const isPositive = trend > 0;
  return (
    <span className={`text-[14px] font-semibold ${isPositive ? 'text-[#ff3b30]' : 'text-[#34c759]'}`}>
      {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
    </span>
  );
}

function GasCard({ data }: { data: GasPrice }) {
  return (
    <div className="rounded-[18px] bg-white border border-[#e0e0e0] p-6">
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">{data.region}</h3>
      <div className="mt-5 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] text-[#7a7a7a] uppercase tracking-[0.5px]">Gasoline</p>
            <p className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] leading-tight">${data.gasoline.toFixed(2)}</p>
          </div>
          <TrendIndicator trend={data.gasolineTrend} />
        </div>
        <div className="flex items-end justify-between border-t border-[#f0f0f0] pt-4">
          <div>
            <p className="text-[12px] text-[#7a7a7a] uppercase tracking-[0.5px]">Diesel</p>
            <p className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] leading-tight">${data.diesel.toFixed(2)}</p>
          </div>
          <TrendIndicator trend={data.dieselTrend} />
        </div>
      </div>
      <p className="mt-5 text-[12px] text-[#7a7a7a]">Updated 2 hours ago</p>
    </div>
  );
}

export default function GasCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {mockGasPrices.map((price) => (
        <GasCard key={price.region} data={price} />
      ))}
    </div>
  );
}
    </section>
  );
}
