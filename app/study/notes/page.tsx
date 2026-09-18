"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LEVEL_LABEL, subjectName, unitName } from "@/lib/study/curriculum";
import {
  RESOLVE_STREAK,
  removeNote,
  setNoteMemo,
  startReviewSession,
  toggleNoteResolved,
} from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { Card, EmptyState, LevelBadge, PageHeader, SectionTitle, Skeleton } from "../components/ui";

const CIRCLED = ["①", "②", "③", "④", "⑤"];

export default function NotesPage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();
  const [filter, setFilter] = useState<"open" | "resolved">("open");
  const [open, setOpen] = useState<string | null>(null);

  const notes = useMemo(() => {
    return Object.values(state.wrongNotes)
      .filter((n) => (filter === "open" ? !n.resolved : n.resolved))
      .sort((a, b) => b.lastWrongAt.localeCompare(a.lastWrongAt));
  }, [state.wrongNotes, filter]);

  const openCount = Object.values(state.wrongNotes).filter((n) => !n.resolved).length;
  const resolvedCount = Object.values(state.wrongNotes).length - openCount;

  if (!hydrated) return <Skeleton />;

  function review() {
    const created = startReviewSession(10);
    if (created) router.push("/study/session");
  }

  return (
    <>
      <PageHeader
        title="오답 노트"
        subtitle={`재출제에서 ${RESOLVE_STREAK}번 연속 맞히면 자동으로 해결 처리됩니다`}
      />

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("open")}
          className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            filter === "open"
              ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
              : "border-zinc-800 text-zinc-500"
          }`}
        >
          미해결 {openCount}
        </button>
        <button
          type="button"
          onClick={() => setFilter("resolved")}
          className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            filter === "resolved"
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
              : "border-zinc-800 text-zinc-500"
          }`}
        >
          해결 {resolvedCount}
        </button>
      </div>

      {openCount > 0 ? (
        <button
          type="button"
          onClick={review}
          className="mb-6 w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          미해결 오답으로 복습 세트 만들기
        </button>
      ) : null}

      {notes.length === 0 ? (
        <EmptyState
          title={filter === "open" ? "미해결 오답이 없습니다" : "해결한 오답이 아직 없습니다"}
          description={
            filter === "open"
              ? "문제를 풀다 틀리면 여기에 자동으로 쌓입니다."
              : "같은 문항을 연속 2회 맞히면 이곳으로 옮겨집니다."
          }
        />
      ) : (
        <section>
          <SectionTitle>{filter === "open" ? "복습이 필요한 문항" : "해결한 문항"}</SectionTitle>
          <div className="space-y-2">
            {notes.map((note) => {
              const q = note.snapshot;
              const expanded = open === note.questionId;
              return (
                <Card key={note.questionId}>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : note.questionId)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-200">
                        {q.body.split("\n")[0]}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span>
                          {subjectName(q.subjectId)} · {unitName(q.unitId)}
                        </span>
                        <LevelBadge level={q.level} />
                        <span className="text-rose-400/80">{note.wrongCount}회 오답</span>
                        {!note.resolved && note.resolvedStreak > 0 ? (
                          <span className="text-emerald-400/80">
                            해결까지 {RESOLVE_STREAK - note.resolvedStreak}회
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-zinc-600">{expanded ? "▲" : "▼"}</span>
                  </button>

                  {expanded ? (
                    <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
                      {q.passage ? (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                          <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">
                            {q.passage}
                          </p>
                        </div>
                      ) : null}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                        {q.body}
                      </p>
                      <ul className="space-y-1">
                        {q.choices.map((c, i) => (
                          <li
                            key={i}
                            className={`flex gap-2 rounded-lg px-3 py-1.5 text-sm ${
                              i === q.answerIndex
                                ? "bg-emerald-500/10 text-emerald-200"
                                : "text-zinc-400"
                            }`}
                          >
                            <span>{CIRCLED[i] ?? i + 1}</span>
                            <span className="flex-1">{c}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="rounded-xl bg-zinc-950/60 p-3">
                        <p className="text-xs font-semibold text-amber-300">💡 핵심 개념</p>
                        <p className="mt-1 text-sm text-zinc-300">{q.keyConcept}</p>
                      </div>

                      <ol className="space-y-1.5">
                        {q.solutionSteps.map((s, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
                            <span className="shrink-0 text-xs text-zinc-600">{i + 1}단계</span>
                            <span className="flex-1 leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ol>

                      <div>
                        <label
                          htmlFor={`memo-${note.questionId}`}
                          className="mb-1.5 block text-xs font-semibold text-zinc-400"
                        >
                          내 메모
                        </label>
                        <textarea
                          id={`memo-${note.questionId}`}
                          value={note.memo}
                          onChange={(e) => setNoteMemo(note.questionId, e.target.value)}
                          rows={2}
                          placeholder="왜 틀렸는지 한 줄로 적어 두면 다음에 같은 실수를 줄일 수 있습니다."
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/60"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleNoteResolved(note.questionId)}
                          className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-600"
                        >
                          {note.resolved ? "미해결로 되돌리기" : "해결로 표시"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeNote(note.questionId)}
                          className="rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-500 transition hover:border-rose-500/40 hover:text-rose-300"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
