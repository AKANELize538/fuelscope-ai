"use client";

import { useState } from "react";

const navItems = [
  { label: "Gas Prices", href: "#gas-prices" },
  { label: "Stocks", href: "#stocks" },
  { label: "News", href: "#news" },
  { label: "Map", href: "#map" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-xl">⛽</span>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-400">FuelScope AI</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-200 transition hover:text-amber-300"
            >
              {item.label}
            </a>
          ))}
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"></span>
            LIVE
          </span>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/80 p-2 text-zinc-200 transition hover:border-amber-400/30 hover:text-amber-300 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <div className="flex h-5 w-5 flex-col items-center justify-between">
            <span className="block h-0.5 w-full rounded-full bg-current" />
            <span className="block h-0.5 w-full rounded-full bg-current" />
            <span className="block h-0.5 w-full rounded-full bg-current" />
          </div>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-zinc-800/80 bg-zinc-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5 hover:text-amber-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"></span>
              LIVE
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
