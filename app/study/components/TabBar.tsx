"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/study", label: "홈", icon: "◎" },
  { href: "/study/plan", label: "계획", icon: "▤" },
  { href: "/study/notes", label: "오답노트", icon: "✎" },
  { href: "/study/weekly", label: "리포트", icon: "◷" },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex w-full max-w-md items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-1.5 backdrop-blur">
        {TABS.map((tab) => {
          const active =
            tab.href === "/study" ? pathname === "/study" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                active
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
