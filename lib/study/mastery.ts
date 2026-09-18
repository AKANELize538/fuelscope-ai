import { LEVEL_ORDER, getUnit } from "./curriculum";
import type { Attempt, Level, MasteryState, StudyState } from "./types";

/**
 * 기초 → 심화 → 응용 승급 규칙.
 *
 *   같은 단원에서 3연속 정답  →  한 단계 승급
 *   같은 단원에서 2연속 오답  →  한 단계 하향
 *
 * 복잡한 통계 모형(IRT 등) 없이도 체감이 명확하고, 학생이 규칙을 이해할 수 있다.
 */

export const PROMOTE_STREAK = 3;
export const DEMOTE_STREAK = 2;

export function nextLevel(level: Level): Level {
  const i = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.min(i + 1, LEVEL_ORDER.length - 1)]!;
}

export function prevLevel(level: Level): Level {
  const i = LEVEL_ORDER.indexOf(level);
  return LEVEL_ORDER[Math.max(i - 1, 0)]!;
}

export function initialMastery(unitId: string, level: Level): MasteryState {
  const unit = getUnit(unitId);
  return {
    unitId,
    subjectId: unit?.subjectId ?? "math",
    level,
    correctStreak: 0,
    wrongStreak: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    updatedAt: new Date().toISOString(),
  };
}

export interface MasteryChange {
  unitId: string;
  from: Level;
  to: Level;
  direction: "up" | "down";
}

/** 한 세션의 풀이 기록을 반영해 숙달도를 갱신한다. */
export function applyAttempts(
  mastery: Record<string, MasteryState>,
  attempts: Attempt[],
): { mastery: Record<string, MasteryState>; changes: MasteryChange[] } {
  const next: Record<string, MasteryState> = { ...mastery };
  const changes: MasteryChange[] = [];

  for (const attempt of attempts) {
    const current =
      next[attempt.unitId] ?? initialMastery(attempt.unitId, attempt.level);

    let correctStreak = current.correctStreak;
    let wrongStreak = current.wrongStreak;
    let level = current.level;

    if (attempt.correct) {
      correctStreak += 1;
      wrongStreak = 0;
      if (correctStreak >= PROMOTE_STREAK && level !== "applied") {
        const to = nextLevel(level);
        changes.push({ unitId: attempt.unitId, from: level, to, direction: "up" });
        level = to;
        correctStreak = 0;
      }
    } else {
      wrongStreak += 1;
      correctStreak = 0;
      if (wrongStreak >= DEMOTE_STREAK && level !== "basic") {
        const to = prevLevel(level);
        changes.push({ unitId: attempt.unitId, from: level, to, direction: "down" });
        level = to;
        wrongStreak = 0;
      }
    }

    next[attempt.unitId] = {
      ...current,
      level,
      correctStreak,
      wrongStreak,
      totalAttempts: current.totalAttempts + 1,
      correctAttempts: current.correctAttempts + (attempt.correct ? 1 : 0),
      updatedAt: new Date().toISOString(),
    };
  }

  return { mastery: next, changes };
}

export function levelOf(state: StudyState, unitId: string, fallback: Level): Level {
  return state.mastery[unitId]?.level ?? fallback;
}

/** 승급까지 남은 정답 수 — 대시보드의 진행 표시에 쓴다. */
export function streakProgress(state: StudyState, unitId: string): {
  correctStreak: number;
  needed: number;
} {
  const m = state.mastery[unitId];
  return {
    correctStreak: m?.correctStreak ?? 0,
    needed: PROMOTE_STREAK,
  };
}
