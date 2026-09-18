import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "./components/shell/AppShell";

export const metadata: Metadata = {
  title: "FuelScope AI",
  description: "Minimal dark theme foundation for FuelScope AI with responsive Tailwind styling.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-white selection:bg-amber-400/30 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
