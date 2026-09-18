import type { Metadata } from "next";
import type { ReactNode } from "react";
import TabBar from "./components/TabBar";

export const metadata: Metadata = {
  title: "학습 플래너 — 대입 보완 프로그램",
  description:
    "내신·모의고사 점수를 바탕으로 취약 단원을 진단하고, 기초–심화–응용 단계별 문제 풀이와 오답 복습까지 한 흐름으로 돕습니다.",
};

export default function StudyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6 sm:px-6 sm:pt-10">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
