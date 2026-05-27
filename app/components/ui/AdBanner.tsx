interface AdBannerProps {
  dataAdSlot: string;
  className?: string;
}

function AdBanner({ dataAdSlot, className }: AdBannerProps) {
  return (
    <div
      data-ad-slot={dataAdSlot}
      className={`flex h-full min-h-[50px] w-full items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-800 text-center text-sm font-semibold text-zinc-300 ${className ?? ''}`}
    >
      {/* Replace with Google AdSense code */}
      Advertisement
    </div>
  );
}

export function LeaderboardAd({ dataAdSlot, className }: AdBannerProps) {
  return (
    <div className={`mx-auto max-w-full overflow-hidden rounded-3xl ${className ?? ''}`} style={{ width: '728px', height: '90px' }}>
      <AdBanner dataAdSlot={dataAdSlot} />
    </div>
  );
}

export function RectangleAd({ dataAdSlot, className }: AdBannerProps) {
  return (
    <div className={`mx-auto max-w-full overflow-hidden rounded-3xl ${className ?? ''}`} style={{ width: '300px', height: '250px' }}>
      <AdBanner dataAdSlot={dataAdSlot} />
    </div>
  );
}

export function BannerAd({ dataAdSlot, className }: AdBannerProps) {
  return (
    <div className={`mx-auto max-w-full overflow-hidden rounded-3xl ${className ?? ''}`} style={{ width: '320px', height: '50px' }}>
      <AdBanner dataAdSlot={dataAdSlot} />
    </div>
  );
}
