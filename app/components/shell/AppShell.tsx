"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../navbar/Navbar";

/**
 * /study 이하의 학습 플래너는 자체 내비게이션(TabBar)을 쓰므로
 * FuelScope 대시보드용 Navbar와 상단 여백을 적용하지 않는다.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/study")) return <>{children}</>;

  return (
    <>
      <Navbar />
      <div className="pt-24">{children}</div>
    </>
  );
}
