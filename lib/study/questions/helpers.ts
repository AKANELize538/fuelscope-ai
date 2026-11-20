import type { Level, Question, SubjectId } from "../types";

/**
 * 문항 작성용 축약 타입.
 * 실제 기출 원문은 저장하지 않으며, 모든 지문·문항은 유형 학습용으로 새로 쓴 것이다.
 */
export interface Draft {
  id: string;
  unit: string;
  topic: string;
  level: Level;
  passage?: string;
  body: string;
  choices: string[];
  /** 0-based 정답 인덱스 */
  answer: number;
  key: string;
  steps: string[];
  review: string;
  sec?: number;
}

const DEFAULT_SECONDS: Record<Level, number> = {
  basic: 60,
  advanced: 100,
  applied: 150,
};

export function build(subjectId: SubjectId, drafts: Draft[]): Question[] {
  return drafts.map((d) => {
    if (d.answer < 0 || d.answer >= d.choices.length) {
      throw new Error(`문항 ${d.id}: 정답 인덱스가 선택지 범위를 벗어났습니다.`);
    }
    return {
      id: d.id,
      subjectId,
      unitId: d.unit,
      topicId: d.topic,
      level: d.level,
      passage: d.passage,
      body: d.body,
      choices: d.choices,
      answerIndex: d.answer,
      keyConcept: d.key,
      solutionSteps: d.steps,
      reviewConcept: d.review,
      estSeconds: d.sec ?? DEFAULT_SECONDS[d.level],
    };
  });
}

/** 결정적 난수 생성기 — 같은 seed면 같은 변형 문항이 나온다. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

/**
 * 정답과 오답 후보를 섞어 4지선다를 만든다.
 *
 * 오답끼리 값이 겹치는 경우가 있으므로(예: p − a 와 a − p 가 p = a 일 때 둘 다 0)
 * 정답을 포함해 전체를 중복 제거한 뒤, 숫자 문항이면 모자란 자리를
 * 정답 주변의 다른 정수로 채운다. 같은 선택지가 두 개 보이면 문항 자체가 무효다.
 */
export function makeChoices(
  rand: () => number,
  answer: string,
  distractors: string[],
): { choices: string[]; answer: number } {
  const pool: string[] = [];
  for (const candidate of [answer, ...distractors]) {
    if (!pool.includes(candidate)) pool.push(candidate);
    if (pool.length === 4) break;
  }

  // 숫자 문항이면 정답 근처의 값으로 빈 자리를 메운다.
  const numeric = Number(answer);
  if (pool.length < 4 && Number.isFinite(numeric)) {
    for (let step = 1; pool.length < 4 && step <= 12; step++) {
      for (const candidate of [String(numeric + step), String(numeric - step)]) {
        if (pool.length < 4 && !pool.includes(candidate)) pool.push(candidate);
      }
    }
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return { choices: pool, answer: pool.indexOf(answer) };
}
