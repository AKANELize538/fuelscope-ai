"use client";

import { useMemo, useState } from 'react';

interface Station {
  name: string;
  address: string;
  distance: string;
  regular: number;
  premium: number;
  diesel: number;
  lat: number;
  lng: number;
}

const mockStations: Station[] = [
  {
    name: 'Shell Station',
    address: '123 Main St',
    distance: '0.3 miles',
    regular: 3.45,
    premium: 3.89,
    diesel: 3.67,
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    name: 'BP Express',
    address: '456 Oak Ave',
    distance: '0.7 miles',
    regular: 3.39,
    premium: 3.84,
    diesel: 3.62,
    lat: 40.7132,
    lng: -74.0038,
  },
  {
    name: '7-Eleven Fuel',
    address: '789 Pine Rd',
    distance: '1.1 miles',
    regular: 3.49,
    premium: 3.95,
    diesel: 3.72,
    lat: 40.7145,
    lng: -74.0091,
  },
  {
    name: 'Mobil Station',
    address: '102 Cedar Blvd',
    distance: '0.9 miles',
    regular: 3.42,
    premium: 3.88,
    diesel: 3.68,
    lat: 40.7118,
    lng: -74.0082,
  },
  {
    name: 'Chevron Corner',
    address: '215 Elm St',
    distance: '1.4 miles',
    regular: 3.54,
    premium: 4.01,
    diesel: 3.79,
    lat: 40.7156,
    lng: -74.0042,
  },
];

function NearestStation() {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const sortedStations = useMemo(() => {
    return [...mockStations].sort((a, b) => a.regular - b.regular);
  }, []);

  const cheapestStation = sortedStations[0];

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLoading(false);
      },
      (error) => {
        setLocationError(error.code === error.PERMISSION_DENIED ? 'GPS permission denied.' : 'Unable to retrieve your location.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Nearest Cheapest Station</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Use your device GPS to compare nearby prices and find the lowest regular fuel rate.
          </p>
        </div>
        <button
          type="button"
          onClick={handleFindNearest}
          className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
        >
          Find Nearest Station
        </button>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-200">Locating your device...</div>
      )}

      {locationError && (
        <div className="rounded-3xl border border-red-500/70 bg-red-500/10 p-6 text-red-200">
          {locationError}
        </div>
      )}

      {userLocation && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-400 bg-zinc-900 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Coordinates</p>
            <p className="mt-3 text-base text-zinc-200">
              Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sortedStations.map((station, index) => {
              const isCheapest = station.name === cheapestStation.name;
              return (
                <div
                  key={station.name}
                  className={`rounded-3xl border p-6 bg-zinc-900 shadow-sm ${isCheapest ? 'border-amber-400' : 'border-zinc-800'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{station.name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{station.address}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300">
                      {station.distance}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Regular</span>
                      <span className="text-amber-300 font-semibold">${station.regular.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Premium</span>
                      <span>${station.premium.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Diesel</span>
                      <span>${station.diesel.toFixed(2)}</span>
                    </div>
                  </div>

                  {isCheapest && (
                    <div className="mt-6 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                      Cheapest station based on regular price
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default NearestStation;
