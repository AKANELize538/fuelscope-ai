"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEVEL_LABEL, SUBJECTS } from "@/lib/study/curriculum";
import { questionCountByUnit } from "@/lib/study/questions";
import { startSession } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import type { Level, SubjectId } from "@/lib/study/types";
import { Card, LevelBadge, PageHeader, SectionTitle, Skeleton } from "../components/ui";

const COUNTS = questionCountByUnit();
const LEVELS: Level[] = ["basic", "advanced", "applied"];

export default function SubjectsPage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();
  const [active, setActive] = useState<SubjectId>("math");
  const [openUnit, setOpenUnit] = useState<string | null>(null);

  if (!hydrated) return <Skeleton />;

  const subject = SUBJECTS.find((s) => s.id === active)!;

  function start(unitId: string, level: Level, mode: 20 | 50) {
    const created = startSession({ mode, subjectId: active, unitId, level });
    if (created) router.push("/study/session");
  }

  return (
    <>
      <PageHeader
        title="학습 트랙"
        subtitle="과목 → 단원 → 유형 → 난이도. 대입 준비에 필요한 경로만 담았습니다"
      />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setActive(s.id);
              setOpenUnit(null);
            }}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              active === s.id
                ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <SectionTitle>{subject.name} 단원</SectionTitle>
      <div className="space-y-2">
        {subject.units.map((unit) => {
          const count = COUNTS[unit.id] ?? 0;
          const level = state.mastery[unit.id]?.level ?? "basic";
          const expanded = openUnit === unit.id;
          return (
            <Card key={unit.id}>
              <button
                type="button"
                onClick={() => setOpenUnit(expanded ? null : unit.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-100">
                    {unit.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    대입 비중 {unit.weight}/5 · 유형 {unit.topics.length}개 ·{" "}
                    {count > 0 ? `문항 ${count}개` : "문항 준비중"}
                  </span>
                </span>
                <LevelBadge level={level} />
                <span className="shrink-0 text-xs text-zinc-600">{expanded ? "▲" : "▼"}</span>
              </button>

              {expanded ? (
                <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-zinc-400">유형</p>
                    <div className="flex flex-wrap gap-1.5">
                      {unit.topics.map((t) => (
                        <span
                          key={t.id}
                          className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {count === 0 ? (
                    <p className="text-xs text-zinc-600">
                      이 단원은 아직 문항이 준비되지 않았습니다. 같은 과목의 다른 문항으로 세트가
                      구성됩니다.
                    </p>
                  ) : null}

                  <div>
                    <p className="mb-2 text-xs font-semibold text-zinc-400">난이도를 골라 시작</p>
                    <div className="grid grid-cols-3 gap-2">
                      {LEVELS.map((lv) => (
                        <button
                          key={lv}
                          type="button"
                          onClick={() => start(unit.id, lv, 20)}
                          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
                        >
                          {LEVEL_LABEL[lv]} · 20분
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => start(unit.id, level, 50)}
                      className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                    >
                      현재 단계({LEVEL_LABEL[level]})로 50분 세트 시작
                    </button>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
        현대 지문과 문항은 유형 학습용으로 새로 작성한 것이고,
        <br />
        고전 작품은 저작권이 소멸한 원문을 출처와 함께 싣습니다.
        <br />
        저작권이 있는 시험지 원문은 저장하거나 노출하지 않습니다.
      </p>
    </>
  );
}
