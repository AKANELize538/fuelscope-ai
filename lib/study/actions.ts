"use client";

import { buildSession, type BuildOptions } from "./assemble";
import { applyAttempts, type MasteryChange } from "./mastery";
import { buildDailyPlan } from "./plan";
import { setState } from "./store";
import { todayKey, uid } from "./storage";
import type {
  Attempt,
  ExamType,
  Profile,
  ScoreRecord,
  StudySession,
  StudyState,
  SubjectId,
  WrongNote,
} from "./types";

/** 오답 노트를 해결 처리하려면 재출제에서 이만큼 연속으로 맞혀야 한다. */
export const RESOLVE_STREAK = 2;

export function saveProfile(profile: Profile): void {
  setState((prev) => ({ ...prev, profile }));
}

export interface DiagnosisEntry {
  subjectId: SubjectId;
  examType: ExamType;
  score: number | null;
  wrongUnitIds: string[];
}

export function saveDiagnosis(entries: DiagnosisEntry[]): void {
  const date = new Date().toISOString();
  const records: ScoreRecord[] = entries
    .filter((e) => e.score !== null)
    .map((e) => ({
      id: uid("score"),
      subjectId: e.subjectId,
      examType: e.examType,
      score: e.score as number,
      wrongUnitIds: e.wrongUnitIds,
      date,
    }));
  setState((prev) => ({ ...prev, scores: [...prev.scores, ...records] }));
}

export function startSession(options: BuildOptions): StudySession | null {
  let created: StudySession | null = null;
  setState((prev) => {
    const session = buildSession(prev, options);
    if (session.questions.length === 0) return prev;
    created = session;
    return { ...prev, activeSession: session };
  });
  return created;
}

export function recordAnswer(index: number, choice: number, spentSec: number): void {
  setState((prev) => {
    const session = prev.activeSession;
    if (!session) return prev;
    const answers = [...session.answers];
    const spent = [...session.spent];
    answers[index] = choice;
    spent[index] = (spent[index] ?? 0) + spentSec;
    return { ...prev, activeSession: { ...session, answers, spent } };
  });
}

export function goToQuestion(index: number): void {
  setState((prev) => {
    const session = prev.activeSession;
    if (!session) return prev;
    const clamped = Math.max(0, Math.min(index, session.questions.length - 1));
    return { ...prev, activeSession: { ...session, currentIndex: clamped } };
  });
}

export function abandonSession(): void {
  setState((prev) => ({ ...prev, activeSession: null }));
}

export interface FinishResult {
  session: StudySession;
  attempts: Attempt[];
  changes: MasteryChange[];
}

/** 세션 채점 + 숙달도 갱신 + 오답 노트 반영을 한 번에 처리한다. */
export function finishSession(): FinishResult | null {
  let result: FinishResult | null = null;

  setState((prev) => {
    const session = prev.activeSession;
    if (!session) return prev;

    const finishedAt = new Date().toISOString();
    const attempts: Attempt[] = session.questions.map((q, i) => ({
      id: uid("att"),
      sessionId: session.id,
      questionId: q.id,
      subjectId: q.subjectId,
      unitId: q.unitId,
      topicId: q.topicId,
      level: q.level,
      chosenIndex: session.answers[i] ?? null,
      correct: session.answers[i] === q.answerIndex,
      timeSpentSec: session.spent[i] ?? 0,
      createdAt: finishedAt,
    }));

    const { mastery, changes } = applyAttempts(prev.mastery, attempts);
    const wrongNotes = updateWrongNotes(prev.wrongNotes, session, attempts, finishedAt);

    const finished: StudySession = { ...session, finishedAt };
    const day = todayKey();
    const studyDays = prev.studyDays.includes(day)
      ? prev.studyDays
      : [...prev.studyDays, day];

    result = { session: finished, attempts, changes };

    return {
      ...prev,
      activeSession: null,
      lastSession: finished,
      attempts: [...prev.attempts, ...attempts],
      mastery,
      wrongNotes,
      studyDays,
    };
  });

  return result;
}

function updateWrongNotes(
  notes: Record<string, WrongNote>,
  session: StudySession,
  attempts: Attempt[],
  at: string,
): Record<string, WrongNote> {
  const next = { ...notes };

  attempts.forEach((attempt, i) => {
    const question = session.questions[i];
    if (!question) return;
    const existing = next[question.id];

    if (!attempt.correct) {
      next[question.id] = {
        questionId: question.id,
        subjectId: question.subjectId,
        unitId: question.unitId,
        topicId: question.topicId,
        level: question.level,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
        lastWrongAt: at,
        resolvedStreak: 0,
        resolved: false,
        memo: existing?.memo ?? "",
        snapshot: question,
      };
      return;
    }

    // 맞혔고 이미 오답 노트에 있던 문항이면 해결 진행도를 올린다.
    if (existing && !existing.resolved) {
      const streak = existing.resolvedStreak + 1;
      next[question.id] = {
        ...existing,
        resolvedStreak: streak,
        resolved: streak >= RESOLVE_STREAK,
      };
    }
  });

  return next;
}

export function setNoteMemo(questionId: string, memo: string): void {
  setState((prev) => {
    const note = prev.wrongNotes[questionId];
    if (!note) return prev;
    return {
      ...prev,
      wrongNotes: { ...prev.wrongNotes, [questionId]: { ...note, memo } },
    };
  });
}

export function toggleNoteResolved(questionId: string): void {
  setState((prev) => {
    const note = prev.wrongNotes[questionId];
    if (!note) return prev;
    return {
      ...prev,
      wrongNotes: {
        ...prev.wrongNotes,
        [questionId]: {
          ...note,
          resolved: !note.resolved,
          resolvedStreak: note.resolved ? 0 : RESOLVE_STREAK,
        },
      },
    };
  });
}

export function removeNote(questionId: string): void {
  setState((prev) => {
    const next = { ...prev.wrongNotes };
    delete next[questionId];
    return { ...prev, wrongNotes: next };
  });
}

/** 오답만 모아 복습 세션을 만든다. */
export function startReviewSession(limit = 10): StudySession | null {
  let created: StudySession | null = null;
  setState((prev) => {
    const open = Object.values(prev.wrongNotes)
      .filter((n) => !n.resolved)
      .sort((a, b) => b.wrongCount - a.wrongCount || a.lastWrongAt.localeCompare(b.lastWrongAt))
      .slice(0, limit);
    if (open.length === 0) return prev;

    const questions = open.map((n) => n.snapshot);
    const session: StudySession = {
      id: uid("ses"),
      mode: 20,
      subjectId: questions[0]!.subjectId,
      targetUnitIds: Array.from(new Set(questions.map((q) => q.unitId))),
      questions,
      answers: questions.map(() => null),
      currentIndex: 0,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      spent: questions.map(() => 0),
    };
    created = session;
    return { ...prev, activeSession: session };
  });
  return created;
}

export function togglePlanItem(date: string, itemId: string): void {
  setState((prev) => {
    const plan = prev.plans[date] ?? buildDailyPlan(prev, date);
    const items = plan.items.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i,
    );
    return { ...prev, plans: { ...prev.plans, [date]: { ...plan, items } } };
  });
}

export function persistPlan(date: string, state: StudyState): void {
  if (state.plans[date]) return;
  setState((prev) =>
    prev.plans[date] ? prev : { ...prev, plans: { ...prev.plans, [date]: buildDailyPlan(prev, date) } },
  );
}
