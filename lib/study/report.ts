import { SUBJECTS, subjectName, unitName } from "./curriculum";
import { weekStartKey } from "./storage";
import type { Attempt, StudyState, SubjectId } from "./types";

/**
 * 주간 점검 리포트.
 * 진도, 정답률, 단계 상승 여부를 집계하고 밀린 단원을 찾아낸다.
 */

export interface SubjectStat {
  subjectId: SubjectId;
  subjectName: string;
  total: number;
  correct: number;
  accuracy: number | null;
}

export interface UnitStat {
  unitId: string;
  unitName: string;
  subjectId: SubjectId;
  total: number;
  correct: number;
  accuracy: number;
}

export interface WeeklyReport {
  weekStart: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number | null;
  studiedDays: number;
  minutesStudied: number;
  bySubject: SubjectStat[];
  weakestUnits: UnitStat[];
  levelUps: string[];
  untouchedUnits: string[];
  openWrongNotes: number;
}

function inThisWeek(iso: string, weekStart: string): boolean {
  const start = new Date(`${weekStart}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t < end.getTime();
}

export function buildWeeklyReport(
  state: StudyState,
  weekStart = weekStartKey(),
): WeeklyReport {
  const attempts = state.attempts.filter((a) => inThisWeek(a.createdAt, weekStart));
  const correct = attempts.filter((a) => a.correct).length;

  const bySubject: SubjectStat[] = SUBJECTS.map((s) => {
    const rows = attempts.filter((a) => a.subjectId === s.id);
    const ok = rows.filter((a) => a.correct).length;
    return {
      subjectId: s.id,
      subjectName: s.name,
      total: rows.length,
      correct: ok,
      accuracy: rows.length === 0 ? null : ok / rows.length,
    };
  });

  const unitMap = new Map<string, { total: number; correct: number; subjectId: SubjectId }>();
  for (const a of attempts) {
    const row = unitMap.get(a.unitId) ?? { total: 0, correct: 0, subjectId: a.subjectId };
    row.total += 1;
    if (a.correct) row.correct += 1;
    unitMap.set(a.unitId, row);
  }

  const weakestUnits: UnitStat[] = Array.from(unitMap.entries())
    .filter(([, v]) => v.total >= 2)
    .map(([unitId, v]) => ({
      unitId,
      unitName: unitName(unitId),
      subjectId: v.subjectId,
      total: v.total,
      correct: v.correct,
      accuracy: v.correct / v.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const days = new Set(attempts.map((a) => a.createdAt.slice(0, 10)));
  const minutes = Math.round(attempts.reduce((s, a) => s + a.timeSpentSec, 0) / 60);

  const levelUps = Object.values(state.mastery)
    .filter((m) => m.level !== "basic" && inThisWeek(m.updatedAt, weekStart))
    .map((m) => `${subjectName(m.subjectId)} · ${unitName(m.unitId)} → ${m.level === "applied" ? "응용" : "심화"}`);

  // 계획에 잡혔지만 이번 주에 한 문제도 풀지 않은 단원 = 밀린 단원
  const planned = new Set<string>();
  for (const [date, plan] of Object.entries(state.plans)) {
    if (!date.startsWith(weekStart.slice(0, 7)) && date < weekStart) continue;
    for (const item of plan.items) if (item.unitId) planned.add(item.unitId);
  }
  const touched = new Set(attempts.map((a) => a.unitId));
  const untouchedUnits = Array.from(planned)
    .filter((u) => !touched.has(u))
    .map((u) => unitName(u));

  return {
    weekStart,
    totalQuestions: attempts.length,
    correctQuestions: correct,
    accuracy: attempts.length === 0 ? null : correct / attempts.length,
    studiedDays: days.size,
    minutesStudied: minutes,
    bySubject,
    weakestUnits,
    levelUps,
    untouchedUnits,
    openWrongNotes: Object.values(state.wrongNotes).filter((n) => !n.resolved).length,
  };
}

/** 연속 학습일 계산 */
export function currentStreak(state: StudyState): number {
  if (state.studyDays.length === 0) return 0;
  const days = new Set(state.studyDays);
  let streak = 0;
  const cursor = new Date();
  // 오늘 아직 안 했으면 어제부터 센다.
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(key(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function recentAttempts(state: StudyState, n = 20): Attempt[] {
  return [...state.attempts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, n);
}
