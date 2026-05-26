'use client';

interface GasPrice {
  region: string;
  gasoline: number;
  diesel: number;
  gasolineTrend: number;
  dieselTrend: number;
}

const mockGasPrices: GasPrice[] = [
  {
    region: 'New York',
    gasoline: 3.45,
    diesel: 3.72,
    gasolineTrend: 2.5,
    dieselTrend: 1.8,
  },
  {
    region: 'Boston',
    gasoline: 3.52,
    diesel: 3.78,
    gasolineTrend: -1.2,
    dieselTrend: 0.5,
  },
  {
    region: 'Philadelphia',
    gasoline: 3.38,
    diesel: 3.65,
    gasolineTrend: 3.1,
    dieselTrend: 2.2,
  },
];

function TrendIndicator({ trend }: { trend: number }) {
  const isPositive = trend > 0;
  const color = isPositive ? 'text-red-400' : 'text-green-400';
  const bgColor = isPositive ? 'bg-red-400/10' : 'bg-green-400/10';

  return (
    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${bgColor} ${color}`}>
      {isPositive ? (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V5a1 1 0 012 0v9.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      <span>{Math.abs(trend)}%</span>
    </div>
  );
}

function GasCard({ data }: { data: GasPrice }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg transition hover:border-zinc-700 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-white">{data.region}</h3>

      <div className="mt-6 space-y-4">
        {/* Gasoline Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-400">Gasoline</p>
            <p className="text-2xl font-bold text-amber-300">${data.gasoline.toFixed(2)}</p>
          </div>
          <TrendIndicator trend={data.gasolineTrend} />
        </div>

        {/* Diesel Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-400">Diesel</p>
            <p className="text-2xl font-bold text-amber-300">${data.diesel.toFixed(2)}</p>
          </div>
          <TrendIndicator trend={data.dieselTrend} />
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500">Last updated: 2 hours ago</p>
      </div>
    </div>
  );
}

export default function GasCards() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-white">Regional Gas Prices</h2>
        <p className="text-zinc-400">Real-time fuel prices across US East Coast regions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockGasPrices.map((price) => (
          <GasCard key={price.region} data={price} />
        ))}
      </div>
    </section>
  );
}
