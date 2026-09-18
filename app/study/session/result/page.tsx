"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LEVEL_LABEL, subjectName, unitName } from "@/lib/study/curriculum";
import { startReviewSession } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { Card, LevelBadge, PageHeader, ProgressBar, SectionTitle, Skeleton } from "../../components/ui";

const CIRCLED = ["①", "②", "③", "④", "⑤"];

export default function SessionResultPage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();
  const session = state.lastSession;
  const [open, setOpen] = useState<number | null>(0);

  const graded = useMemo(() => {
    if (!session) return [];
    return session.questions.map((q, i) => ({
      question: q,
      chosen: session.answers[i],
      correct: session.answers[i] === q.answerIndex,
    }));
  }, [session]);

  if (!hydrated) return <Skeleton />;

  if (!session) {
    return (
      <Card>
        <p className="text-sm text-zinc-400">채점할 세트가 없습니다.</p>
        <Link href="/study" className="mt-3 inline-block text-sm text-emerald-400">
          홈으로 →
        </Link>
      </Card>
    );
  }

  const correctCount = graded.filter((g) => g.correct).length;
  const total = graded.length;
  const wrong = graded.filter((g) => !g.correct);
  const accuracy = total === 0 ? 0 : correctCount / total;
  const minutes = Math.round(session.spent.reduce((s, v) => s + v, 0) / 60);

  function reviewNow() {
    const created = startReviewSession(10);
    if (created) router.push("/study/session");
  }

  return (
    <>
      <PageHeader
        title="채점 결과"
        subtitle={`${subjectName(session.subjectId)} · ${session.mode}분 세트 · ${minutes}분 소요`}
      />

      <Card className="mb-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold tabular-nums text-zinc-100">
              {correctCount}
              <span className="text-lg text-zinc-600"> / {total}</span>
            </p>
            <p className="mt-1 text-sm text-zinc-500">정답률 {Math.round(accuracy * 100)}%</p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              accuracy >= 0.8
                ? "bg-emerald-500/15 text-emerald-300"
                : accuracy >= 0.5
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-rose-500/15 text-rose-300"
            }`}
          >
            {accuracy >= 0.8 ? "잘하고 있어요" : accuracy >= 0.5 ? "조금 더" : "기초부터 다시"}
          </span>
        </div>
        <div className="mt-4">
          <ProgressBar
            value={correctCount}
            max={total || 1}
            tone={accuracy >= 0.8 ? "emerald" : accuracy >= 0.5 ? "amber" : "rose"}
          />
        </div>
      </Card>

      {wrong.length > 0 ? (
        <Card className="mb-6 border-rose-500/25 bg-rose-500/5">
          <p className="text-sm text-rose-200">
            {wrong.length}문항이 오답 노트에 자동 저장되었습니다.
          </p>
          <p className="mt-1 text-xs text-rose-300/60">
            재출제에서 2번 연속 맞히면 해결 처리됩니다.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={reviewNow}
              className="rounded-xl bg-rose-500/90 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-rose-400"
            >
              바로 복습하기
            </button>
            <Link
              href="/study/notes"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300"
            >
              오답 노트 보기
            </Link>
          </div>
        </Card>
      ) : null}

      <section className="mb-6">
        <SectionTitle>문항별 풀이</SectionTitle>
        <div className="space-y-2">
          {graded.map((g, i) => {
            const expanded = open === i;
            return (
              <Card key={`${g.question.id}-${i}`} className={g.correct ? "" : "border-rose-500/30"}>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      g.correct
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {g.correct ? "○" : "✗"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-zinc-200">
                      {i + 1}. {g.question.body.split("\n")[0]}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {unitName(g.question.unitId)} · {LEVEL_LABEL[g.question.level]}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-600">{expanded ? "▲" : "▼"}</span>
                </button>

                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
                    {g.question.passage ? (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">
                          {g.question.passage}
                        </p>
                      </div>
                    ) : null}

                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                      {g.question.body}
                    </p>

                    <ul className="space-y-1.5">
                      {g.question.choices.map((choice, ci) => {
                        const isAnswer = ci === g.question.answerIndex;
                        const isChosen = ci === g.chosen;
                        return (
                          <li
                            key={ci}
                            className={`flex gap-2 rounded-lg px-3 py-2 text-sm ${
                              isAnswer
                                ? "bg-emerald-500/10 text-emerald-200"
                                : isChosen
                                  ? "bg-rose-500/10 text-rose-200"
                                  : "text-zinc-400"
                            }`}
                          >
                            <span>{CIRCLED[ci] ?? ci + 1}</span>
                            <span className="flex-1">{choice}</span>
                            {isAnswer ? <span className="text-xs">정답</span> : null}
                            {isChosen && !isAnswer ? (
                              <span className="text-xs">내 답</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="rounded-xl bg-zinc-950/60 p-3">
                      <p className="text-xs font-semibold text-amber-300">💡 핵심 개념</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                        {g.question.keyConcept}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold text-zinc-400">📝 단계별 풀이</p>
                      <ol className="space-y-1.5">
                        {g.question.solutionSteps.map((step, si) => (
                          <li key={si} className="flex gap-2.5 text-sm text-zinc-300">
                            <span className="shrink-0 text-xs text-zinc-600">{si + 1}단계</span>
                            <span className="flex-1 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {!g.correct ? (
                      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                        <p className="text-xs font-semibold text-rose-300">🔁 복습할 개념</p>
                        <p className="mt-1 text-sm leading-relaxed text-rose-100/80">
                          {g.question.reviewConcept}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>

      <div className="flex gap-2">
        <Link
          href="/study"
          className="flex-1 rounded-2xl bg-emerald-500 px-5 py-4 text-center text-base font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          오늘 할 일로 돌아가기
        </Link>
      </div>
    </>
  );
}
