"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { LEVEL_LABEL, subjectName, unitName } from "@/lib/study/curriculum";
import { subjectGaps, topWeakUnits } from "@/lib/study/diagnosis";
import { ensurePlan } from "@/lib/study/plan";
import { currentStreak } from "@/lib/study/report";
import { startReviewSession, startSession, togglePlanItem } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { todayKey } from "@/lib/study/storage";
import type { PlanItem } from "@/lib/study/types";
import { Card, LevelBadge, PageHeader, ProgressBar, SectionTitle, Skeleton } from "./components/ui";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function StudyHomePage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();
  const date = todayKey();

  const plan = useMemo(() => ensurePlan(state, date), [state, date]);
  const weak = useMemo(() => topWeakUnits(state, 3), [state]);
  const gaps = useMemo(() => subjectGaps(state).filter((g) => g.current !== null), [state]);
  const streak = useMemo(() => currentStreak(state), [state]);

  if (!hydrated) return <Skeleton />;

  if (!state.profile) {
    return (
      <>
        <PageHeader
          title="대입 학습 보완"
          subtitle="취약점 진단부터 오답 복습까지 한 흐름으로"
        />
        <Card className="mb-4">
          <ol className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="text-emerald-400">1</span> 학년 · 목표 점수 · 하루 공부 시간 입력
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">2</span> 최근 내신 / 모의고사 점수 입력
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">3</span> 취약 단원 TOP 3 진단
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400">4</span> 오늘 할 학습 → 문제 풀이 → 오답 복습
            </li>
          </ol>
        </Card>
        <Link
          href="/study/onboarding"
          className="block w-full rounded-2xl bg-emerald-500 px-5 py-4 text-center text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          시작하기
        </Link>
      </>
    );
  }

  const openNotes = Object.values(state.wrongNotes).filter((n) => !n.resolved).length;
  const doneMinutes = plan.items.filter((i) => i.done).reduce((s, i) => s + i.minutes, 0);

  function handleStart(item: PlanItem) {
    if (item.kind === "review") {
      const created = startReviewSession(10);
      if (created) router.push("/study/session");
      return;
    }
    if (!item.unitId || !item.subjectId) return;
    const target = weak.find((w) => w.unitId === item.unitId);
    const created = startSession({
      mode: item.minutes >= 50 ? 50 : 20,
      subjectId: item.subjectId,
      unitId: item.unitId,
      level: state.mastery[item.unitId]?.level ?? target?.level ?? "basic",
    });
    if (created) router.push("/study/session");
  }

  return (
    <>
      <PageHeader
        title="오늘의 학습"
        subtitle={`${state.profile.grade} · 하루 ${state.profile.dailyMinutes}분 기준`}
        right={
          streak > 0 ? (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300">
              🔥 연속 {streak}일
            </span>
          ) : undefined
        }
      />

      {state.activeSession ? (
        <Card className="mb-6 border-emerald-500/40 bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-200">진행 중인 세트가 있습니다</p>
          <p className="mt-1 text-xs text-emerald-300/70">
            {state.activeSession.questions.length}문항 ·{" "}
            {state.activeSession.answers.filter((a) => a !== null).length}문항 풀이 완료
          </p>
          <Link
            href="/study/session"
            className="mt-3 inline-block rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            이어서 풀기
          </Link>
        </Card>
      ) : null}

      {gaps.length > 0 ? (
        <section className="mb-6">
          <SectionTitle>목표까지</SectionTitle>
          <Card className="space-y-3">
            {gaps.map((g) => (
              <div key={g.subjectId}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="text-zinc-300">{g.subjectName}</span>
                  <span className="tabular-nums text-zinc-400">
                    {g.current} → {g.target}
                    {g.gap > 0 ? <span className="ml-2 text-rose-400">−{g.gap}</span> : null}
                  </span>
                </div>
                <ProgressBar value={g.current ?? 0} max={g.target || 1} tone={g.gap > 0 ? "amber" : "emerald"} />
              </div>
            ))}
          </Card>
        </section>
      ) : null}

      <section className="mb-6">
        <SectionTitle
          action={
            <Link href="/study/diagnosis" className="text-xs text-zinc-500 hover:text-zinc-300">
              점수 다시 입력
            </Link>
          }
        >
          이번 주 우선 보완 TOP 3
        </SectionTitle>
        {weak.length === 0 ? (
          <Card>
            <p className="text-sm text-zinc-400">진단 데이터가 없습니다.</p>
            <Link href="/study/diagnosis" className="mt-3 inline-block text-sm text-emerald-400">
              점수 입력하기 →
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {weak.map((w, i) => (
              <Card key={w.unitId}>
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{MEDALS[i]}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
                    {subjectName(w.subjectId)} · {unitName(w.unitId)}
                  </span>
                  <LevelBadge level={w.level} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <SectionTitle
          action={
            <span className="text-xs tabular-nums text-zinc-500">
              {doneMinutes} / {plan.totalMinutes}분
            </span>
          }
        >
          오늘 할 일
        </SectionTitle>
        <div className="space-y-2">
          {plan.items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlanItem(date, item.id)}
                  aria-label={item.done ? "완료 취소" : "완료 표시"}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs transition ${
                    item.done
                      ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                      : "border-zinc-700 text-transparent hover:border-zinc-500"
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      item.done ? "text-zinc-600 line-through" : "text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-zinc-500">{item.minutes}분</span>
                {item.kind !== "self" && !item.done ? (
                  <button
                    type="button"
                    onClick={() => handleStart(item)}
                    className="shrink-0 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    시작
                  </button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/study/notes"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-zinc-700"
        >
          <p className="text-2xl font-semibold tabular-nums text-zinc-100">{openNotes}</p>
          <p className="mt-0.5 text-xs text-zinc-500">해결 안 된 오답</p>
        </Link>
        <Link
          href="/study/weekly"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-zinc-700"
        >
          <p className="text-2xl font-semibold tabular-nums text-zinc-100">{state.attempts.length}</p>
          <p className="mt-0.5 text-xs text-zinc-500">누적 풀이 문항</p>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        단계 규칙 — 같은 단원 3연속 정답 시 {LEVEL_LABEL.basic}→{LEVEL_LABEL.advanced}→
        {LEVEL_LABEL.applied} 승급, 2연속 오답 시 한 단계 하향
      </p>
    </>
  );
}
