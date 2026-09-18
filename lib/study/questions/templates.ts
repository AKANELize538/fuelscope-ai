import type { Question, QuestionTemplate } from "../types";
import { makeChoices, mulberry32, randInt } from "./helpers";

/**
 * 변형 문항 생성기.
 *
 * DB 문항이 모자랄 때 같은 유형의 숫자·조건만 바꿔 새 문항을 만든다.
 * seed가 같으면 항상 같은 문항이 나오므로, 오답 노트에 저장한 변형 문항도
 * 나중에 똑같이 재현된다.
 */
export const TEMPLATES: QuestionTemplate[] = [
  {
    id: "tpl-seq-arith",
    subjectId: "math", unitId: "ma-seq", topicId: "ma-seq-arith", level: "basic",
    build: (rand) => {
      const a1 = randInt(rand, 2, 9);
      const d = randInt(rand, 2, 7);
      const n = randInt(rand, 6, 14);
      const value = a1 + (n - 1) * d;
      const { choices, answer } = makeChoices(rand, String(value), [
        String(a1 + n * d),
        String(value + d),
        String(value - d),
      ]);
      return {
        subjectId: "math", unitId: "ma-seq", topicId: "ma-seq-arith", level: "basic",
        body: `첫째항이 ${a1}, 공차가 ${d}인 등차수열 {aₙ}에서 a${n}의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "등차수열의 일반항 aₙ = a₁ + (n−1)d",
        solutionSteps: [
          `a₁ = ${a1}, d = ${d}, n = ${n}을 대입한다.`,
          `a${n} = ${a1} + (${n} − 1) × ${d}`,
          `= ${a1} + ${(n - 1) * d} = ${value}`,
        ],
        reviewConcept: "등차수열 일반항 — 곱해지는 것은 n이 아니라 (n−1)이다.",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-seq-geo",
    subjectId: "math", unitId: "ma-seq", topicId: "ma-seq-geo", level: "basic",
    build: (rand) => {
      const a1 = randInt(rand, 2, 5);
      const r = randInt(rand, 2, 4);
      const n = randInt(rand, 4, 6);
      const value = a1 * Math.pow(r, n - 1);
      const { choices, answer } = makeChoices(rand, String(value), [
        String(a1 * Math.pow(r, n)),
        String(a1 * Math.pow(r, n - 2)),
        String(value + r),
      ]);
      return {
        subjectId: "math", unitId: "ma-seq", topicId: "ma-seq-geo", level: "basic",
        body: `첫째항이 ${a1}, 공비가 ${r}인 등비수열 {aₙ}에서 a${n}의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "등비수열의 일반항 aₙ = a₁ · r^(n−1)",
        solutionSteps: [
          `a₁ = ${a1}, r = ${r}, n = ${n}을 대입한다.`,
          `a${n} = ${a1} × ${r}^${n - 1}`,
          `= ${a1} × ${Math.pow(r, n - 1)} = ${value}`,
        ],
        reviewConcept: "등비수열 일반항 — 지수는 n−1이다.",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-diff-value",
    subjectId: "math", unitId: "ma-diff", topicId: "ma-diff-basic", level: "basic",
    build: (rand) => {
      const a = randInt(rand, 2, 5);
      const b = randInt(rand, 1, 7);
      const c = randInt(rand, 1, 4);
      const value = 2 * a * c + b;
      const { choices, answer } = makeChoices(rand, String(value), [
        String(a * c * c + b * c),
        String(value + a),
        String(2 * a * c),
      ]);
      return {
        subjectId: "math", unitId: "ma-diff", topicId: "ma-diff-basic", level: "basic",
        body: `f(x) = ${a}x² + ${b}x 일 때, f′(${c})의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "(xⁿ)′ = n·xⁿ⁻¹ — 항별로 미분한다.",
        solutionSteps: [
          `f′(x) = ${2 * a}x + ${b}`,
          `f′(${c}) = ${2 * a} × ${c} + ${b}`,
          `= ${2 * a * c} + ${b} = ${value}`,
        ],
        reviewConcept: "다항함수 미분 — 미분한 뒤에 값을 대입한다(순서 주의).",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-integral-def",
    subjectId: "math", unitId: "ma-integral", topicId: "ma-integral-basic", level: "basic",
    build: (rand) => {
      const a = randInt(rand, 2, 6);
      const b = randInt(rand, 2, 5);
      const value = (a * b * b) / 2;
      const { choices, answer } = makeChoices(rand, String(value), [
        String(a * b),
        String(value * 2),
        String(a * b * b),
      ]);
      return {
        subjectId: "math", unitId: "ma-integral", topicId: "ma-integral-basic", level: "basic",
        body: `∫(0 to ${b}) ${a}x dx 의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "∫ax dx = (a/2)x² + C",
        solutionSteps: [
          `${a}x의 부정적분은 ${a / 2 === Math.floor(a / 2) ? a / 2 : `${a}/2`}x² 이다.`,
          `위끝 ${b}를 대입: (${a} × ${b}²) ÷ 2`,
          `= ${value}`,
        ],
        reviewConcept: "정적분 — 아래끝이 0이면 위끝 값만 계산하면 된다.",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-log-basic",
    subjectId: "math", unitId: "ma-explog", topicId: "ma-explog-law", level: "basic",
    build: (rand) => {
      const base = [2, 3, 5][randInt(rand, 0, 2)]!;
      const k = randInt(rand, 2, 4);
      const value = Math.pow(base, k);
      const { choices, answer } = makeChoices(rand, String(k), [
        String(k + 1),
        String(k - 1),
        String(base),
      ]);
      return {
        subjectId: "math", unitId: "ma-explog", topicId: "ma-explog-law", level: "basic",
        body: `log${base === 2 ? "₂" : base === 3 ? "₃" : "₅"} ${value} 의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "log_a b = x ⟺ aˣ = b",
        solutionSteps: [
          `구하는 값을 x라 하면 ${base}ˣ = ${value}`,
          `${value} = ${base}^${k} 이므로`,
          `x = ${k}`,
        ],
        reviewConcept: "로그의 정의 — '밑을 몇 제곱해야 진수가 되는가'",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-prob-comb",
    subjectId: "math", unitId: "ma-prob", topicId: "ma-prob-count", level: "basic",
    build: (rand) => {
      const n = randInt(rand, 5, 8);
      const r = randInt(rand, 2, 3);
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
      const value = fact(n) / (fact(r) * fact(n - r));
      const { choices, answer } = makeChoices(rand, String(value), [
        String(fact(n) / fact(n - r)),
        String(value + n),
        String(n * r),
      ]);
      return {
        subjectId: "math", unitId: "ma-prob", topicId: "ma-prob-count", level: "basic",
        body: `서로 다른 ${n}개의 물건 중에서 ${r}개를 택하는 경우의 수는?`,
        choices, answerIndex: answer,
        keyConcept: "순서를 따지지 않으면 조합 ₙCᵣ = n! / (r!(n−r)!)",
        solutionSteps: [
          `₍${n}₎C₍${r}₎ = ${n}! ÷ (${r}! × ${n - r}!)`,
          `= ${fact(n) / fact(n - r)} ÷ ${fact(r)}`,
          `= ${value}`,
        ],
        reviewConcept: "조합과 순열 — 순서가 중요한지 먼저 판단한다.",
        estSeconds: 60,
      };
    },
  },
];

/** seed를 바꿔 가며 변형 문항을 n개 만든다. */
export function generateVariants(
  template: QuestionTemplate,
  count: number,
  seedBase: number,
): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  // 같은 숫자가 겹치면 건너뛰므로 넉넉히 돌린다.
  for (let i = 0; out.length < count && i < count * 8; i++) {
    const rand = mulberry32(seedBase + i * 7919);
    const draft = template.build(rand);
    const fingerprint = draft.body;
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    out.push({
      ...draft,
      id: `${template.id}-v${seedBase + i}`,
      variantOf: template.id,
    });
  }
  return out;
}

export function templatesFor(unitId: string, level?: string): QuestionTemplate[] {
  return TEMPLATES.filter(
    (t) => t.unitId === unitId && (level === undefined || t.level === level),
  );
}
