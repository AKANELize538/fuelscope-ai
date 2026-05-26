import HeroSection from "../components/sections/HeroSection";
import DashboardContainer from "../components/DashboardContainer";
import PriceCard from "../components/cards/PriceCard";
import RegionalPriceCard from "../components/cards/RegionalPriceCard";
import EnergyStockCard from "../components/cards/EnergyStockCard";
import AIMarketSummary from "../components/cards/AIMarketSummary";
import LatestEnergyNews from "../components/sections/LatestEnergyNews";
import {
  gasPriceData,
  dieselPriceData,
  regionalPricesData,
  energyStocksData,
  aiMarketSummaryData,
  newsData,
} from "../lib/mockData";

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />

      <DashboardContainer>
        {/* Gas & Diesel Price Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Fuel Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceCard {...gasPriceData} />
            <PriceCard {...dieselPriceData} />
          </div>
        </section>

        {/* Regional Gas Prices Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Regional Gas Prices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalPricesData.map((region) => (
              <RegionalPriceCard key={region.id} {...region} />
            ))}
          </div>
        </section>

        {/* Energy Stocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Energy Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {energyStocksData.map((stock) => (
              <EnergyStockCard key={stock.id} {...stock} />
            ))}
          </div>
        </section>

        {/* AI Market Summary Section */}
        <section className="mb-12">
          <AIMarketSummary {...aiMarketSummaryData} />
        </section>

        {/* Latest Energy News Section */}
        <section className="mb-12">
          <LatestEnergyNews news={newsData} />
        </section>
      </DashboardContainer>
    </div>
  );
}
