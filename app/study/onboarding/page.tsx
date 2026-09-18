"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS } from "@/lib/study/curriculum";
import { saveProfile } from "@/lib/study/actions";
import type { Grade, GoalType, SubjectId } from "@/lib/study/types";
import { Card, PageHeader } from "../components/ui";

const GRADES: Grade[] = ["고1", "고2", "고3", "N수"];

const GOALS: { id: GoalType; label: string; detail: string }[] = [
  { id: "suneung", label: "수능 중심", detail: "모의고사·수능형 문항 비중을 높입니다" },
  { id: "naesin", label: "내신 중심", detail: "단원별 빈출 변형 문항 비중을 높입니다" },
  { id: "both", label: "둘 다", detail: "기본값 — 균형 있게 배분합니다" },
];

const TIME_OPTIONS = [30, 60, 90, 120, 180, 240];

export default function OnboardingPage() {
  const router = useRouter();
  const [grade, setGrade] = useState<Grade>("고2");
  const [goalType, setGoalType] = useState<GoalType>("both");
  const [dailyMinutes, setDailyMinutes] = useState(120);
  const [targets, setTargets] = useState<Record<SubjectId, number>>({
    korean: 90,
    math: 90,
    english: 90,
    inquiry: 45,
  });

  function submit() {
    saveProfile({
      grade,
      goalType,
      targets,
      dailyMinutes,
      createdAt: new Date().toISOString(),
    });
    router.push("/study/diagnosis");
  }

  return (
    <>
      <PageHeader
        title="시작하기"
        subtitle="1단계 / 2단계 · 학년과 목표를 입력하면 학습량이 이 기준으로 계산됩니다"
      />

      <div className="space-y-4">
        <Card>
          <p className="mb-3 text-sm font-medium text-zinc-300">학년</p>
          <div className="grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  grade === g
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-medium text-zinc-300">목표</p>
          <div className="space-y-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoalType(g.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  goalType === g.id
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-zinc-100">{g.label}</span>
                  <span className="block text-xs text-zinc-500">{g.detail}</span>
                </span>
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    goalType === g.id ? "border-emerald-400 bg-emerald-400" : "border-zinc-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-1 text-sm font-medium text-zinc-300">목표 점수</p>
          <p className="mb-3 text-xs text-zinc-500">
            합격 예측이 아니라, 오늘 무엇을 먼저 할지 정하는 기준으로만 씁니다.
          </p>
          <div className="space-y-3">
            {SUBJECTS.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm text-zinc-400">{s.name}</span>
                <input
                  type="range"
                  min={0}
                  max={s.maxScore}
                  step={1}
                  value={targets[s.id]}
                  onChange={(e) =>
                    setTargets((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))
                  }
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-400"
                />
                <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-200">
                  {targets[s.id]} / {s.maxScore}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-1 text-sm font-medium text-zinc-300">하루 공부 가능 시간</p>
          <p className="mb-3 text-xs text-zinc-500">
            계획은 이 시간을 절대 넘기지 않습니다. 지킬 수 있는 값을 넣어 주세요.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDailyMinutes(m)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  dailyMinutes === m
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                {m >= 60 ? `${m / 60}시간` : `${m}분`}
              </button>
            ))}
          </div>
        </Card>

        <button
          type="button"
          onClick={submit}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          다음 — 점수 입력하기
        </button>
      </div>
    </>
  );
}
