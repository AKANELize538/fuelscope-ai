"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LEVEL_LABEL } from "@/lib/study/curriculum";
import { computeWeakUnits, subjectGaps } from "@/lib/study/diagnosis";
import { useStudyState } from "@/lib/study/store";
import { Card, LevelBadge, PageHeader, ProgressBar, SectionTitle, Skeleton } from "../../components/ui";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function DiagnosisResultPage() {
  const { state, hydrated } = useStudyState();

  const weak = useMemo(
    () => computeWeakUnits(state).filter((w) => w.priority > 0),
    [state],
  );
  const gaps = useMemo(() => subjectGaps(state), [state]);

  if (!hydrated) return <Skeleton />;

  if (state.scores.length === 0) {
    return (
      <>
        <PageHeader title="진단 결과" />
        <Card>
          <p className="text-sm text-zinc-400">아직 입력된 점수가 없습니다.</p>
          <Link
            href="/study/diagnosis"
            className="mt-4 inline-block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950"
          >
            점수 입력하러 가기
          </Link>
        </Card>
      </>
    );
  }

  const top3 = weak.slice(0, 3);

  return (
    <>
      <PageHeader
        title="진단 결과"
        subtitle="점수 · 직접 체크한 단원 · 실제 정답률을 합쳐 계산했습니다"
      />

      <section className="mb-6">
        <SectionTitle>이번 주 우선 보완 단원 TOP 3</SectionTitle>
        <div className="space-y-2">
          {top3.map((w, i) => (
            <Card key={w.unitId}>
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none">{MEDALS[i]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-zinc-100">
                      {w.subjectName} · {w.unitName}
                    </span>
                    <LevelBadge level={w.level} />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                    {w.reasons.join(" · ")}
                  </p>
                  <p className="mt-2 text-xs text-emerald-400/80">
                    → {LEVEL_LABEL[w.level]} 단계부터 시작합니다
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {top3.length === 0 ? (
            <Card>
              <p className="text-sm text-zinc-400">
                진단할 단원이 없습니다. 점수를 다시 입력해 주세요.
              </p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="mb-6">
        <SectionTitle>과목별 목표까지</SectionTitle>
        <Card className="space-y-4">
          {gaps.map((g) => (
            <div key={g.subjectId}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="text-zinc-300">{g.subjectName}</span>
                <span className="tabular-nums text-zinc-400">
                  {g.current === null ? (
                    <span className="text-zinc-600">미입력</span>
                  ) : (
                    <>
                      {g.current} → {g.target}
                      {g.gap > 0 ? (
                        <span className="ml-2 text-rose-400">−{g.gap}</span>
                      ) : (
                        <span className="ml-2 text-emerald-400">달성</span>
                      )}
                    </>
                  )}
                </span>
              </div>
              <ProgressBar
                value={g.current ?? 0}
                max={g.target || 1}
                tone={g.gap > 0 ? "amber" : "emerald"}
              />
            </div>
          ))}
        </Card>
      </section>

      <section className="mb-6">
        <SectionTitle>전체 단원 우선순위</SectionTitle>
        <Card>
          <ul className="divide-y divide-zinc-800">
            {weak.slice(0, 12).map((w) => (
              <li key={w.unitId} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 truncate text-sm text-zinc-300">
                  <span className="text-zinc-500">{w.subjectName}</span> · {w.unitName}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <LevelBadge level={w.level} />
                  <span className="w-10 text-right text-xs tabular-nums text-zinc-500">
                    {w.priority.toFixed(1)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-600">
            숫자가 클수록 먼저 보완해야 하는 단원입니다. 문제를 풀수록 실제 정답률이 반영되어
            순위가 바뀝니다.
          </p>
        </Card>
      </section>

      <Link
        href="/study"
        className="block w-full rounded-2xl bg-emerald-500 px-5 py-4 text-center text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
      >
        오늘 할 학습 보러 가기
      </Link>
    </>
  );
}
