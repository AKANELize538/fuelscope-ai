# FuelScope AI ⛽

> A production-ready Next.js 15 dashboard template for energy market intelligence — built with Apple-inspired design, AI-powered news summaries, and real-time data integrations.

**[Live Demo →](https://fuelscope-ai.vercel.app)**

---

## What's Included

- **Apple Design System** — Clean white/parchment tiles, SF Pro typography, blue pill CTAs
- **AI News Summaries** — Real energy headlines summarized by Llama 3.3 70B via Groq API
- **Regional Gas Prices** — Modular card components (ready for EIA or GasBuddy API)
- **Energy Stocks** — Ticker cards (ready for Alpha Vantage or Yahoo Finance API)
- **Interactive Map** — Mapbox GL JS with custom markers
- **GPS Nearest Station** — Browser geolocation hook ready to connect
- **Fully Responsive** — Mobile-first, works on all screen sizes

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Groq API (Llama 3.3 70B) | AI news summaries |
| GNews API | Live energy headlines |
| Mapbox GL JS | Interactive map |
| Vercel | Deployment |

---

## Getting Started

\`\`\`bash
git clone https://github.com/AKANELize538/fuelscope-ai.git
cd fuelscope-ai
npm install
cp .env.example .env.local
npm run dev
\`\`\`

---

## Environment Variables

\`\`\`env
GNEWS_API_KEY=your_gnews_key
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
\`\`\`

All APIs have free tiers — no paid subscription required.

---

## Customization

- **Gas prices**: Replace mock data in \`app/components/gas/GasCards.tsx\` with EIA or GasBuddy API
- **Stocks**: Replace mock data in \`app/components/stocks/StockCards.tsx\` with Alpha Vantage API
- **News query**: Edit search keywords in \`app/api/news/route.ts\`
- **Map center**: Edit coordinates in \`app/components/map/MapView.tsx\`

---

## License

MIT — use it for personal or commercial projects.
