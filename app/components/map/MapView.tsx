'use client';

import { useEffect, useRef } from 'react';

type Station = {
  name: string;
  price: string;
  coords: [number, number];
};

const stations: Station[] = [
  { name: 'East Harbor Station', price: '$3.95/gal', coords: [-74.006, 40.7128] },
  { name: 'Midtown Fuel', price: '$4.12/gal', coords: [-73.935242, 40.73061] },
  { name: 'Atlantic Service', price: '$3.89/gal', coords: [-76.6122, 39.2904] },
  { name: 'Cape Energy', price: '$4.05/gal', coords: [-71.0596, 42.3601] },
];

export default function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current) return;

    let map: any;
    let mapboxgl: any;

    const setupMap = async () => {
      const mapbox = await import('mapbox-gl');
      mapboxgl = mapbox.default;
      mapboxgl.accessToken = token;

      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.0, 39.5],
        zoom: 4.5,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

      stations.forEach((station) => {
        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(
          `<strong>${station.name}</strong><p style="margin:0.25rem 0 0;color:#cbd5e1;font-size:0.9rem;">${station.price}</p>`
        );

        new mapboxgl.Marker({ color: '#f59e0b' })
          .setLngLat(station.coords)
          .setPopup(popup)
          .addTo(map);
      });
    };

    setupMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>

          <p className="max-w-2xl text-sm text-zinc-400">
            A dark Mapbox view centered on the US East Coast with mock gas station markers.
          </p>
        </div>
      </div>
      <div className="h-[420px] overflow-hidden rounded-3xl border border-zinc-800" ref={containerRef} />
    </section>
  );
}
