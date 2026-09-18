import { getUnit } from "./curriculum";
import { generateVariants, questionsBy, templatesFor } from "./questions";
import { uid } from "./storage";
import type {
  Level,
  Question,
  SessionMode,
  StudySession,
  StudyState,
  SubjectId,
} from "./types";

/**
 * 문제 세트 조립기.
 *
 * 세트 구성 (기획 사양)
 *   20분 : 기초 5 + 심화 3 + 오답 유사 2  =  10문항
 *   50분 : 기초 8 + 심화 7 + 응용 2 + 오답 유사 3 = 20문항
 *
 * 우선순위
 *   ① 약점 단원 + 현재 단계의 DB 문항
 *   ② 같은 단원의 다른 단계
 *   ③ 같은 과목의 같은 단계
 *   ④ 그래도 모자라면 변형 문제 생성
 */

export interface SetRecipe {
  basic: number;
  advanced: number;
  applied: number;
  review: number;
}

export const RECIPES: Record<SessionMode, SetRecipe> = {
  20: { basic: 5, advanced: 3, applied: 0, review: 2 },
  50: { basic: 8, advanced: 7, applied: 2, review: 3 },
};

/** 최근 이 일수 안에 푼 문항은 새 문제로 다시 내지 않는다(오답 복습은 예외). */
const RECENT_DAYS = 3;

function recentlySeen(state: StudyState): Set<string> {
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const set = new Set<string>();
  for (const a of state.attempts) {
    if (Date.parse(a.createdAt) >= cutoff && a.correct) set.add(a.questionId);
  }
  return set;
}

function shuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/** 우선순위 순서대로 문항을 끌어와 필요한 개수를 채운다. */
function pick(
  need: number,
  level: Level,
  unitId: string,
  subjectId: SubjectId,
  used: Set<string>,
  avoid: Set<string>,
  seed: number,
): Question[] {
  if (need <= 0) return [];
  const out: Question[] = [];

  const pools: Question[][] = [
    // ① 약점 단원 + 해당 단계
    questionsBy({ unitId, level }),
    // ② 같은 과목의 같은 단계
    //    단계를 단원보다 먼저 맞춘다. 기초 단계 학생에게 같은 단원이라는 이유로
    //    응용 문항을 주면 학습이 무너지기 때문이다.
    questionsBy({ subjectId, level }),
    // ③ 같은 단원의 다른 단계
    questionsBy({ unitId }),
    // ④ 같은 과목 전체
    questionsBy({ subjectId }),
  ];

  for (const pool of pools) {
    // 최근에 맞힌 문항은 1순위에서 제외하고, 마지막 단계에서만 허용한다.
    const strict = shuffle(
      pool.filter((q) => !used.has(q.id) && !avoid.has(q.id)),
      seed + out.length,
    );
    for (const q of strict) {
      if (out.length >= need) break;
      out.push(q);
      used.add(q.id);
    }
    if (out.length >= need) return out;
  }

  // 그래도 모자라면 변형 문제를 만들어 채운다.
  const templates = templatesFor(unitId, level).concat(templatesFor(unitId));
  for (const tpl of templates) {
    if (out.length >= need) break;
    const variants = generateVariants(tpl, need - out.length, seed + out.length * 31);
    for (const v of variants) {
      if (out.length >= need) break;
      if (used.has(v.id)) continue;
      out.push(v);
      used.add(v.id);
    }
  }

  // 마지막 수단: 최근에 푼 문항이라도 다시 낸다(빈 세트보다는 낫다).
  if (out.length < need) {
    const relaxed = shuffle(
      questionsBy({ subjectId }).filter((q) => !used.has(q.id)),
      seed + 7,
    );
    for (const q of relaxed) {
      if (out.length >= need) break;
      out.push(q);
      used.add(q.id);
    }
  }

  return out;
}

/** 오답 노트에서 복습 문항을 꺼낸다(틀린 횟수가 많고 오래된 것부터). */
function pickReview(
  state: StudyState,
  need: number,
  subjectId: SubjectId,
  used: Set<string>,
): Question[] {
  if (need <= 0) return [];
  const notes = Object.values(state.wrongNotes)
    .filter((n) => !n.resolved && !used.has(n.questionId))
    .sort((a, b) => {
      if (a.subjectId === subjectId && b.subjectId !== subjectId) return -1;
      if (b.subjectId === subjectId && a.subjectId !== subjectId) return 1;
      if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
      return a.lastWrongAt.localeCompare(b.lastWrongAt);
    });

  const out: Question[] = [];
  for (const note of notes) {
    if (out.length >= need) break;
    out.push(note.snapshot);
    used.add(note.questionId);
  }
  return out;
}

const LEVEL_RANK: Record<Level, number> = { basic: 0, advanced: 1, applied: 2 };

/** 기초 → 심화 → 응용 순으로 정렬한다(같은 단계 안의 순서는 유지). */
export function sortByDifficulty(questions: Question[]): Question[] {
  return questions
    .map((q, i) => ({ q, i }))
    .sort((a, b) => LEVEL_RANK[a.q.level] - LEVEL_RANK[b.q.level] || a.i - b.i)
    .map((x) => x.q);
}

export interface BuildOptions {
  mode: SessionMode;
  subjectId: SubjectId;
  unitId: string;
  level: Level;
}

export function buildSession(
  state: StudyState,
  options: BuildOptions,
): StudySession {
  const recipe = RECIPES[options.mode];
  const used = new Set<string>();
  const avoid = recentlySeen(state);
  const seed = Date.now() % 100000;
  const unit = getUnit(options.unitId);
  const subjectId = unit?.subjectId ?? options.subjectId;

  // 진단 단계에 따라 기초/심화/응용 비중을 옮긴다.
  const counts = shiftByLevel(recipe, options.level);

  // 오답 노트가 비어 있으면 복습 자리를 비워 두지 않고 새 문항으로 메운다.
  // (세트 문항 수가 들쭉날쭉하면 20분/50분이라는 약속이 깨진다.)
  const review = pickReview(state, counts.review, subjectId, used);
  const filled = fillShortfall(counts, options.level, counts.review - review.length);

  const questions: Question[] = [
    ...review,
    ...pick(filled.basic, "basic", options.unitId, subjectId, used, avoid, seed),
    ...pick(filled.advanced, "advanced", options.unitId, subjectId, used, avoid, seed + 11),
    ...pick(filled.applied, "applied", options.unitId, subjectId, used, avoid, seed + 23),
  ];

  // 쉬운 문항부터 풀도록 난이도 오름차순으로 배열한다.
  // 기초 단계 학생이 첫 문항부터 심화를 만나면 시작 자체가 어려워진다.
  // (같은 단계 안의 순서는 pick 단계에서 이미 섞여 있다.)
  const ordered = sortByDifficulty(questions);

  return {
    id: uid("ses"),
    mode: options.mode,
    subjectId,
    targetUnitIds: [options.unitId],
    questions: ordered,
    answers: ordered.map(() => null),
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    spent: ordered.map(() => 0),
  };
}

/** 채우지 못한 복습 자리를 현재 단계의 문항으로 돌린다. */
export function fillShortfall(
  counts: SetRecipe,
  level: Level,
  shortfall: number,
): SetRecipe {
  if (shortfall <= 0) return counts;
  if (level === "basic") return { ...counts, basic: counts.basic + shortfall };
  if (level === "advanced") return { ...counts, advanced: counts.advanced + shortfall };
  return { ...counts, applied: counts.applied + shortfall };
}

/**
 * 현재 단계가 높을수록 기초 비중을 줄이고 응용 비중을 늘린다.
 * 전체 문항 수는 그대로 유지한다.
 */
export function shiftByLevel(recipe: SetRecipe, level: Level): SetRecipe {
  const total = recipe.basic + recipe.advanced + recipe.applied;
  if (level === "basic") {
    return { ...recipe };
  }
  if (level === "advanced") {
    const basic = Math.max(1, Math.round(total * 0.3));
    const applied = Math.round(total * 0.2);
    return { basic, advanced: total - basic - applied, applied, review: recipe.review };
  }
  const basic = Math.max(1, Math.round(total * 0.15));
  const applied = Math.round(total * 0.45);
  return { basic, advanced: total - basic - applied, applied, review: recipe.review };
}

export function estimatedMinutes(session: StudySession): number {
  const sec = session.questions.reduce((sum, q) => sum + q.estSeconds, 0);
  return Math.round(sec / 60);
}
