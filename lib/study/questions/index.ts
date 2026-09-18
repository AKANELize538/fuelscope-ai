import type { Level, Question, SubjectId } from "../types";
import { KOREAN_QUESTIONS } from "./korean";
import { MATH_QUESTIONS } from "./math";
import { ENGLISH_QUESTIONS } from "./english";
import { INQUIRY_QUESTIONS } from "./inquiry";

export const QUESTION_BANK: Question[] = [
  ...KOREAN_QUESTIONS,
  ...MATH_QUESTIONS,
  ...ENGLISH_QUESTIONS,
  ...INQUIRY_QUESTIONS,
];

const BY_ID = new Map<string, Question>(QUESTION_BANK.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id);
}

export function questionsBy(filter: {
  subjectId?: SubjectId;
  unitId?: string;
  topicId?: string;
  level?: Level;
}): Question[] {
  return QUESTION_BANK.filter((q) => {
    if (filter.subjectId && q.subjectId !== filter.subjectId) return false;
    if (filter.unitId && q.unitId !== filter.unitId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    if (filter.level && q.level !== filter.level) return false;
    return true;
  });
}

/** 단원별 보유 문항 수 — 학습 트리 화면에서 '준비중' 표시에 쓴다. */
export function questionCountByUnit(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of QUESTION_BANK) {
    counts[q.unitId] = (counts[q.unitId] ?? 0) + 1;
  }
  return counts;
}

export { TEMPLATES, generateVariants, templatesFor } from "./templates";
