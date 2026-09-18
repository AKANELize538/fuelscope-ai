"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EXAM_LABEL, SUBJECTS } from "@/lib/study/curriculum";
import { questionCountByUnit } from "@/lib/study/questions";
import { saveDiagnosis, type DiagnosisEntry } from "@/lib/study/actions";
import type { ExamType, SubjectId } from "@/lib/study/types";
import { Card, PageHeader } from "../components/ui";

const COUNTS = questionCountByUnit();

type Entry = { score: string; examType: ExamType; wrongUnitIds: string[] };

export default function DiagnosisPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Record<SubjectId, Entry>>({
    korean: { score: "", examType: "mock", wrongUnitIds: [] },
    math: { score: "", examType: "mock", wrongUnitIds: [] },
    english: { score: "", examType: "mock", wrongUnitIds: [] },
    inquiry: { score: "", examType: "mock", wrongUnitIds: [] },
  });

  function update(id: SubjectId, patch: Partial<Entry>) {
    setEntries((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function toggleUnit(id: SubjectId, unitId: string) {
    setEntries((prev) => {
      const current = prev[id].wrongUnitIds;
      const next = current.includes(unitId)
        ? current.filter((u) => u !== unitId)
        : [...current, unitId];
      return { ...prev, [id]: { ...prev[id], wrongUnitIds: next } };
    });
  }

  const hasAnyScore = SUBJECTS.some((s) => entries[s.id].score.trim() !== "");

  function submit() {
    const payload: DiagnosisEntry[] = SUBJECTS.map((s) => {
      const raw = entries[s.id].score.trim();
      const parsed = raw === "" ? null : Number(raw);
      const score =
        parsed === null || Number.isNaN(parsed)
          ? null
          : Math.max(0, Math.min(s.maxScore, parsed));
      return {
        subjectId: s.id,
        examType: entries[s.id].examType,
        score,
        wrongUnitIds: entries[s.id].wrongUnitIds,
      };
    });
    saveDiagnosis(payload);
    router.push("/study/diagnosis/result");
  }

  return (
    <>
      <PageHeader
        title="취약점 진단"
        subtitle="2단계 / 2단계 · 30초면 충분합니다. 모르는 항목은 비워 두어도 됩니다"
      />

      <Card className="mb-4 border-amber-500/20 bg-amber-500/5">
        <p className="text-sm text-amber-200/90">
          점수만으로는 어느 단원이 약한지 알 수 없습니다.
          <span className="text-amber-100"> 틀린 문제가 많았던 단원</span>을 함께 골라 주셔야
          진단이 정확해집니다.
        </p>
      </Card>

      <div className="space-y-4">
        {SUBJECTS.map((subject) => {
          const entry = entries[subject.id];
          return (
            <Card key={subject.id}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-zinc-100">{subject.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-zinc-800 p-0.5">
                    {(["mock", "school"] as ExamType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update(subject.id, { examType: t })}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          entry.examType === t
                            ? "bg-zinc-700 text-zinc-100"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {EXAM_LABEL[t]}
                      </button>
                    ))}
                  </div>
                  <input
                    inputMode="numeric"
                    placeholder="점수"
                    value={entry.score}
                    onChange={(e) =>
                      update(subject.id, { score: e.target.value.replace(/[^0-9]/g, "") })
                    }
                    className="w-20 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-right text-sm tabular-nums text-zinc-100 outline-none focus:border-emerald-500/60"
                  />
                  <span className="text-xs text-zinc-600">/ {subject.maxScore}</span>
                </div>
              </div>

              <p className="mb-2 mt-4 text-xs text-zinc-500">틀린 문제가 많았던 단원</p>
              <div className="flex flex-wrap gap-2">
                {subject.units.map((unit) => {
                  const on = entry.wrongUnitIds.includes(unit.id);
                  const ready = (COUNTS[unit.id] ?? 0) > 0;
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => toggleUnit(subject.id, unit.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        on
                          ? "border-rose-500/50 bg-rose-500/15 text-rose-200"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {on ? "✓ " : ""}
                      {unit.name}
                      {!ready ? <span className="ml-1 text-zinc-600">(문항 준비중)</span> : null}
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}

        <button
          type="button"
          onClick={submit}
          disabled={!hasAnyScore}
          className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          {hasAnyScore ? "진단 결과 보기" : "점수를 최소 한 과목 입력해 주세요"}
        </button>
      </div>
    </>
  );
}
