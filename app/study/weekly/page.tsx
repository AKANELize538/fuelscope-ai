"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { subjectName } from "@/lib/study/curriculum";
import { buildWeeklyReport, currentStreak } from "@/lib/study/report";
import { topWeakUnits } from "@/lib/study/diagnosis";
import { startSession } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { weekStartKey } from "@/lib/study/storage";
import { Card, EmptyState, PageHeader, ProgressBar, SectionTitle, Skeleton } from "../components/ui";

export default function WeeklyPage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();

  const report = useMemo(() => buildWeeklyReport(state, weekStartKey()), [state]);
  const streak = useMemo(() => currentStreak(state), [state]);
  const weak = useMemo(() => topWeakUnits(state, 1), [state]);

  if (!hydrated) return <Skeleton />;

  if (report.totalQuestions === 0) {
    return (
      <>
        <PageHeader title="주간 리포트" subtitle={`${report.weekStart} 주간`} />
        <EmptyState
          title="이번 주 풀이 기록이 없습니다"
          description="한 세트라도 풀면 진도·정답률·단계 변화가 이곳에 집계됩니다."
          action={
            <Link
              href="/study"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950"
            >
              오늘 할 일 보기
            </Link>
          }
        />
      </>
    );
  }

  function startMiniTest() {
    const target = weak[0];
    if (!target) return;
    const created = startSession({
      mode: 20,
      subjectId: target.subjectId,
      unitId: target.unitId,
      level: state.mastery[target.unitId]?.level ?? target.level,
    });
    if (created) router.push("/study/session");
  }

  return (
    <>
      <PageHeader
        title="주간 리포트"
        subtitle={`${report.weekStart} 주간 · 연속 ${streak}일 학습`}
      />

      <div className="mb-6 grid grid-cols-3 gap-2">
        <Card className="text-center">
          <p className="text-2xl font-semibold tabular-nums text-zinc-100">
            {report.totalQuestions}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">푼 문항</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold tabular-nums text-zinc-100">
            {report.accuracy === null ? "–" : `${Math.round(report.accuracy * 100)}%`}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">정답률</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-semibold tabular-nums text-zinc-100">
            {report.studiedDays}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">학습한 날</p>
        </Card>
      </div>

      <section className="mb-6">
        <SectionTitle>과목별 정답률</SectionTitle>
        <Card className="space-y-4">
          {report.bySubject.map((s) => (
            <div key={s.subjectId}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="text-zinc-300">{s.subjectName}</span>
                <span className="tabular-nums text-zinc-500">
                  {s.total === 0 ? (
                    <span className="text-zinc-600">기록 없음</span>
                  ) : (
                    <>
                      {s.correct} / {s.total} ·{" "}
                      {Math.round((s.accuracy ?? 0) * 100)}%
                    </>
                  )}
                </span>
              </div>
              <ProgressBar
                value={s.correct}
                max={s.total || 1}
                tone={
                  (s.accuracy ?? 0) >= 0.8 ? "emerald" : (s.accuracy ?? 0) >= 0.5 ? "amber" : "rose"
                }
              />
            </div>
          ))}
        </Card>
      </section>

      {report.levelUps.length > 0 ? (
        <section className="mb-6">
          <SectionTitle>단계 상승</SectionTitle>
          <Card className="border-emerald-500/25 bg-emerald-500/5">
            <ul className="space-y-1.5">
              {report.levelUps.map((l) => (
                <li key={l} className="text-sm text-emerald-200">
                  ▲ {l}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}

      {report.weakestUnits.length > 0 ? (
        <section className="mb-6">
          <SectionTitle>이번 주 가장 약했던 단원</SectionTitle>
          <Card>
            <ul className="divide-y divide-zinc-800">
              {report.weakestUnits.map((u) => (
                <li key={u.unitId} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm text-zinc-300">
                    <span className="text-zinc-500">{subjectName(u.subjectId)}</span> · {u.unitName}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-rose-400">
                    {Math.round(u.accuracy * 100)}% ({u.correct}/{u.total})
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}

      {report.untouchedUnits.length > 0 ? (
        <section className="mb-6">
          <SectionTitle>밀린 단원</SectionTitle>
          <Card className="border-amber-500/25 bg-amber-500/5">
            <p className="text-sm text-amber-200">
              계획에는 있었지만 한 문제도 풀지 않은 단원이 {report.untouchedUnits.length}개 있습니다.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-100/70">
              {report.untouchedUnits.slice(0, 5).map((u) => (
                <li key={u}>· {u}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-100/50">
              다음 주 계획에서 우선순위가 자동으로 올라갑니다. 공부량을 늘리지 않고 순서만 바꿉니다.
            </p>
          </Card>
        </section>
      ) : null}

      <section className="mb-6">
        <SectionTitle>이번 주 약점 미니 점검</SectionTitle>
        <Card>
          <p className="text-sm text-zinc-300">
            {weak[0]
              ? `${subjectName(weak[0].subjectId)} · ${weak[0].unitName} 단원으로 20분 점검 세트를 만듭니다.`
              : "진단 데이터가 쌓이면 미니 점검을 만들 수 있습니다."}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            미해결 오답 {report.openWrongNotes}문항이 함께 섞여 나옵니다.
          </p>
          <button
            type="button"
            onClick={startMiniTest}
            disabled={!weak[0]}
            className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            20분 미니 점검 시작
          </button>
        </Card>
      </section>
    </>
  );
}
