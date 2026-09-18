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

/** 정답과 오답 후보를 섞어 4지선다를 만든다. */
export function makeChoices(
  rand: () => number,
  answer: string,
  distractors: string[],
): { choices: string[]; answer: number } {
  const pool = [answer, ...distractors.filter((d) => d !== answer)].slice(0, 4);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return { choices: pool, answer: pool.indexOf(answer) };
}
