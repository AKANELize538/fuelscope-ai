"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LEVEL_LABEL, subjectName, unitName } from "@/lib/study/curriculum";
import { abandonSession, finishSession, goToQuestion, recordAnswer } from "@/lib/study/actions";
import { useStudyState } from "@/lib/study/store";
import { Card, LevelBadge, Skeleton } from "../components/ui";

const CIRCLED = ["①", "②", "③", "④", "⑤"];

function formatClock(sec: number): string {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SessionPage() {
  const router = useRouter();
  const { state, hydrated } = useStudyState();
  const session = state.activeSession;

  const [elapsed, setElapsed] = useState(0);
  const questionStart = useRef(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const index = session?.currentIndex ?? 0;
  useEffect(() => {
    questionStart.current = Date.now();
  }, [index]);

  if (!hydrated) return <Skeleton />;

  if (!session) {
    return (
      <Card>
        <p className="text-sm text-zinc-400">진행 중인 문제 세트가 없습니다.</p>
        <Link href="/study" className="mt-3 inline-block text-sm text-emerald-400">
          홈으로 돌아가기 →
        </Link>
      </Card>
    );
  }

  const question = session.questions[index];
  if (!question) {
    return (
      <Card>
        <p className="text-sm text-zinc-400">문항을 불러올 수 없습니다.</p>
      </Card>
    );
  }

  const limitSec = session.mode * 60;
  const remaining = limitSec - elapsed;
  const answered = session.answers.filter((a) => a !== null).length;
  const isLast = index === session.questions.length - 1;

  function choose(choiceIndex: number) {
    const spent = Math.round((Date.now() - questionStart.current) / 1000);
    recordAnswer(index, choiceIndex, spent);
    questionStart.current = Date.now();
  }

  function next() {
    if (isLast) return;
    goToQuestion(index + 1);
  }

  function submit() {
    const result = finishSession();
    if (result) router.push("/study/session/result");
  }

  function quit() {
    abandonSession();
    router.push("/study");
  }

  return (
    <div className="pb-4">
      <header className="mb-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="flex min-w-0 items-center gap-2 text-zinc-400">
            <span className="truncate">
              {subjectName(question.subjectId)} · {unitName(question.unitId)}
            </span>
            <LevelBadge level={question.level} />
          </span>
          <span
            className={`shrink-0 tabular-nums ${
              remaining < 0 ? "text-rose-400" : remaining < 120 ? "text-amber-400" : "text-zinc-400"
            }`}
          >
            ⏱ {remaining < 0 ? "+" : ""}
            {formatClock(Math.abs(remaining))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {session.questions.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToQuestion(i)}
                aria-label={`${i + 1}번 문항으로 이동`}
                className={`h-1.5 flex-1 rounded-full transition ${
                  i === index
                    ? "bg-emerald-400"
                    : session.answers[i] !== null
                      ? "bg-zinc-500"
                      : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
          <span className="shrink-0 text-xs tabular-nums text-zinc-500">
            {index + 1} / {session.questions.length}
          </span>
        </div>
      </header>

      <Card className="mb-4">
        {question.passage ? (
          <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-300">
              {question.passage}
            </p>
          </div>
        ) : null}

        <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-zinc-100">
          {question.body}
        </p>

        <div className="mt-5 space-y-2">
          {question.choices.map((choice, i) => {
            const selected = session.answers[index] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "border-emerald-500/60 bg-emerald-500/10 text-zinc-100"
                    : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <span className={selected ? "text-emerald-400" : "text-zinc-600"}>
                  {CIRCLED[i] ?? i + 1}
                </span>
                <span className="flex-1 leading-relaxed">{choice}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => goToQuestion(index - 1)}
          disabled={index === 0}
          className="rounded-2xl border border-zinc-800 px-5 py-3.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-700 disabled:opacity-40"
        >
          이전
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            채점하기 ({answered} / {session.questions.length} 풀이)
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            다음 문제 →
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
        <span>
          {session.mode}분 모드 · {LEVEL_LABEL[question.level]} 단계
        </span>
        <button type="button" onClick={quit} className="hover:text-zinc-400">
          그만두기
        </button>
      </div>
    </div>
  );
}
