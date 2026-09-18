"use client";

import Link from "next/link";
import { useMemo } from "react";
import { subjectName, unitName } from "@/lib/study/curriculum";
import { buildRoadmap, ensurePlan } from "@/lib/study/plan";
import { togglePlanItem } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { todayKey } from "@/lib/study/storage";
import { Card, EmptyState, PageHeader, ProgressBar, SectionTitle, Skeleton } from "../components/ui";

export default function PlanPage() {
  const { state, hydrated } = useStudyState();
  const date = todayKey();

  const plan = useMemo(() => ensurePlan(state, date), [state, date]);
  const roadmap = useMemo(() => buildRoadmap(state, 4), [state]);

  if (!hydrated) return <Skeleton />;

  if (!state.profile) {
    return (
      <>
        <PageHeader title="학습 계획" />
        <EmptyState
          title="먼저 목표를 설정해 주세요"
          description="하루 공부 가능 시간을 알아야 계획을 만들 수 있습니다."
          action={
            <Link
              href="/study/onboarding"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950"
            >
              시작하기
            </Link>
          }
        />
      </>
    );
  }

  const doneMinutes = plan.items.filter((i) => i.done).reduce((s, i) => s + i.minutes, 0);

  return (
    <>
      <PageHeader
        title="학습 계획"
        subtitle="학원 없이 가능한 분량으로만 배분합니다"
      />

      <Card className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-zinc-400">오늘 진행률</span>
          <span className="text-sm tabular-nums text-zinc-300">
            {doneMinutes} / {plan.totalMinutes}분
          </span>
        </div>
        <ProgressBar value={doneMinutes} max={plan.totalMinutes || 1} />
        <p className="mt-3 text-xs text-zinc-600">
          하루 가능 시간의 70%는 약점 단원 세션, 20%는 오답 복습, 나머지는 자율 학습으로
          배분됩니다.
        </p>
      </Card>

      <section className="mb-8">
        <SectionTitle>오늘 ({date})</SectionTitle>
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
                <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                  {item.minutes}분
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle>4주 로드맵</SectionTitle>
        <div className="space-y-2">
          {roadmap.map((week) => (
            <Card key={week.week}>
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-zinc-100">{week.label}</span>
                <span className="text-xs tabular-nums text-zinc-500">
                  주 {Math.round(week.minutesPerWeek / 60)}시간
                </span>
              </div>
              {week.focus.length === 0 ? (
                <p className="text-xs text-zinc-600">진단 데이터가 쌓이면 채워집니다.</p>
              ) : (
                <ul className="space-y-2">
                  {week.focus.map((f) => (
                    <li key={f.unitId} className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-zinc-300">
                        <span className="text-zinc-500">{subjectName(f.subjectId as never)}</span> ·{" "}
                        {unitName(f.unitId)}
                      </span>
                      <span className="shrink-0 text-xs text-zinc-500">
                        {f.from}
                        {f.from !== f.to ? (
                          <span className="text-emerald-400"> → {f.to}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-sky-500/20 bg-sky-500/5">
        <p className="text-sm font-medium text-sky-200">비용 없이 쓸 수 있는 보조 자료</p>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-sky-100/70">
          <li>· EBSi — 수능 연계 교재 강의 무료 시청</li>
          <li>· 한국교육과정평가원 — 모의평가·수능 문제와 정답 공개 자료</li>
          <li>· 시·도교육청 학력평가 — 학년별 기출과 해설</li>
        </ul>
        <p className="mt-3 text-[11px] text-sky-100/40">
          이 앱은 외부 자료를 복제하지 않습니다. 자율 학습 시간에 직접 활용하세요.
        </p>
      </Card>
    </>
  );
}
