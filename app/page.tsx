import GasCards from './components/gas/GasCards';
import StockCards from './components/stocks/StockCards';
import NewsSection from './components/news/NewsSection';
import MapView from './components/map/MapView';

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p className="inline-flex rounded-full bg-amber-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          FuelScope AI
        </p>
        <div className="mt-8 space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Clean energy intelligence for smarter fuel insights.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            A mobile-first foundation with a dark zinc theme, amber accents, and responsive utility styling built for Next.js 15.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
              href="#overview"
            >
              Start building
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-400/40 hover:text-amber-300"
              href="#features"
            >
              Explore the design
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <GasCards />
      </section>

      <section className="mt-12">
        <StockCards />
      </section>

      <section className="mt-12">
        <NewsSection />
      </section>

      <section className="mt-12">
        <MapView />
      </section>

      <section id="overview" className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-semibold text-white">Foundation built for Day 1</h2>
          <p className="text-zinc-300 leading-8">
            This home page is intentionally minimal and production-ready. It provides a clean structure for future dashboards, AI features, and energy analytics without mock data.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-zinc-950/80 p-5 text-zinc-200 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-white">Responsive by default</h3>
              <p className="mt-2 text-sm text-zinc-400">Mobile-first utility classes adapt seamlessly across screen sizes.</p>
            </div>
            <div className="rounded-3xl bg-zinc-950/80 p-5 text-zinc-200 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-white">Dark theme ready</h3>
              <p className="mt-2 text-sm text-zinc-400">Zinc 950 background with high-contrast white text and amber highlights.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">What comes next</h2>
          <ul className="mt-6 space-y-4 text-zinc-300">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              Add AI-powered fuel forecasting and market summaries.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              Build reusable dashboard cards and charts.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
              Connect to APIs using environment-safe configuration.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
