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

    // 선택지가 모자라거나 같은 값이 두 번 나오면 문항으로 쓸 수 없다.
    // 템플릿에 실수가 있어도 학생에게는 절대 노출되지 않도록 여기서 막는다.
    if (draft.choices.length < 4) continue;
    if (new Set(draft.choices).size !== draft.choices.length) continue;
    if (draft.answerIndex < 0 || draft.answerIndex >= draft.choices.length) continue;

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

// ────────────────────────────────────────────────────────────
// 고1 공통수학 변형 생성기
// 내신 기출에서 숫자만 바꿔 반복 출제되는 유형들이다.
// ────────────────────────────────────────────────────────────

const COMMON_TEMPLATES: QuestionTemplate[] = [
  {
    id: "tpl-func-comp",
    subjectId: "math", unitId: "ma-func", topicId: "ma-func-comp", level: "basic",
    build: (rand) => {
      const a = randInt(rand, 2, 5);
      const b = randInt(rand, 1, 6);
      const c = randInt(rand, 1, 5);
      const x = randInt(rand, 2, 7);
      const inner = x - c;
      const value = a * inner + b;
      const { choices, answer } = makeChoices(rand, String(value), [
        String(a * x + b - c),
        String(a * (x + c) + b),
        String(value + a),
      ]);
      return {
        subjectId: "math", unitId: "ma-func", topicId: "ma-func-comp", level: "basic",
        body: `두 함수 f(x) = ${a}x + ${b}, g(x) = x − ${c} 에 대하여 (f∘g)(${x})의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "(f∘g)(x) = f(g(x)) — 안쪽 g부터 계산한다.",
        solutionSteps: [
          `g(${x}) = ${x} − ${c} = ${inner}`,
          `f(${inner}) = ${a} × ${inner} + ${b}`,
          `= ${a * inner} + ${b} = ${value}`,
        ],
        reviewConcept: "합성함수의 계산 순서 — f∘g 는 g를 먼저 적용한다.",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-func-inv",
    subjectId: "math", unitId: "ma-func", topicId: "ma-func-inv", level: "basic",
    build: (rand) => {
      const a = randInt(rand, 2, 6);
      const b = randInt(rand, 1, 8);
      const x = randInt(rand, 2, 6);
      const k = a * x + b;
      const { choices, answer } = makeChoices(rand, String(x), [
        String(k),
        String(x + 1),
        String(a * k + b),
      ]);
      return {
        subjectId: "math", unitId: "ma-func", topicId: "ma-func-inv", level: "basic",
        body: `함수 f(x) = ${a}x + ${b} 에 대하여 f⁻¹(${k})의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "f⁻¹(k) = a ⟺ f(a) = k",
        solutionSteps: [
          `f⁻¹(${k}) = t 라 하면 f(t) = ${k}`,
          `${a}t + ${b} = ${k} → ${a}t = ${k - b}`,
          `t = ${x}`,
        ],
        reviewConcept: "역함수 값은 '어떤 x를 넣어야 그 값이 나오는가'를 묻는 것이다.",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-rational-asym",
    subjectId: "math", unitId: "ma-rational", topicId: "ma-rational-asym", level: "basic",
    build: (rand) => {
      const a = randInt(rand, 2, 6);
      const p = randInt(rand, 1, 5);
      const r = randInt(rand, 2, 9);
      // y = (a·x + (r − a·p)) / (x − p) = a + r/(x − p)
      const numerConst = r - a * p;
      const sign = numerConst >= 0 ? "+" : "−";
      const abs = Math.abs(numerConst);
      const value = p + a;
      const { choices, answer } = makeChoices(rand, String(value), [
        String(p - a),
        String(a - p),
        String(value + 1),
      ]);
      return {
        subjectId: "math", unitId: "ma-rational", topicId: "ma-rational-asym", level: "basic",
        body: `유리함수 y = (${a}x ${sign} ${abs})/(x − ${p}) 의 그래프의 점근선이 두 직선 x = m, y = n 일 때, m + n 의 값은?`,
        choices, answerIndex: answer,
        keyConcept: "분자를 분모의 배수 + 나머지로 쪼개면 점근선이 보인다.",
        solutionSteps: [
          `${a}x ${sign} ${abs} = ${a}(x − ${p}) + ${r}`,
          `y = ${a} + ${r}/(x − ${p}) 이므로 점근선은 x = ${p}, y = ${a}`,
          `m + n = ${p} + ${a} = ${value}`,
        ],
        reviewConcept: "(ax+b)/(cx+d) 의 수평 점근선은 y = a/c 이다.",
        estSeconds: 70,
      };
    },
  },
  {
    id: "tpl-irr-domain",
    subjectId: "math", unitId: "ma-irrational", topicId: "ma-irr-domain", level: "basic",
    build: (rand) => {
      const p = randInt(rand, 1, 7);
      const q = randInt(rand, 1, 5);
      // 오답은 정답과도, 서로와도 반드시 달라야 한다.
      // (q 를 그대로 쓰면 p = q 일 때 정답과 겹친다.)
      const { choices, answer } = makeChoices(rand, `{x | x ≥ ${p}}`, [
        `{x | x ≤ ${p}}`,
        `{x | x ≥ ${p + q}}`,
        `{x | x ≥ ${p - 1}}`,
      ]);
      return {
        subjectId: "math", unitId: "ma-irrational", topicId: "ma-irr-domain", level: "basic",
        body: `무리함수 y = √(x − ${p}) + ${q} 의 정의역은?`,
        choices, answerIndex: answer,
        keyConcept: "근호 안은 0 이상이어야 한다.",
        solutionSteps: [
          `x − ${p} ≥ 0`,
          `x ≥ ${p}`,
          `따라서 정의역은 {x | x ≥ ${p}}`,
        ],
        reviewConcept: "무리함수의 정의역은 (근호 안) ≥ 0 에서 나온다.",
        estSeconds: 55,
      };
    },
  },
  {
    id: "tpl-count-perm",
    subjectId: "math", unitId: "ma-count", topicId: "ma-count-perm", level: "basic",
    build: (rand) => {
      const n = randInt(rand, 5, 8);
      const r = randInt(rand, 2, 3);
      let value = 1;
      const parts: number[] = [];
      for (let i = 0; i < r; i++) {
        value *= n - i;
        parts.push(n - i);
      }
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
      const { choices, answer } = makeChoices(rand, String(value), [
        String(value / fact(r)),
        String(value * (n - r)),
        String(n * r),
      ]);
      return {
        subjectId: "math", unitId: "ma-count", topicId: "ma-count-perm", level: "basic",
        body: `서로 다른 ${n}개의 물건 중에서 ${r}개를 택하여 일렬로 나열하는 경우의 수는?`,
        choices, answerIndex: answer,
        keyConcept: "택해서 '나열'하면 순열 ₙPᵣ 이다.",
        solutionSteps: [
          `₍${n}₎P₍${r}₎ = ${parts.join(" × ")}`,
          `= ${value}`,
          "순서를 따지므로 조합이 아니라 순열이다.",
        ],
        reviewConcept: "나열·줄세우기·자리배치 = 순열",
        estSeconds: 60,
      };
    },
  },
  {
    id: "tpl-prop-negation",
    subjectId: "math", unitId: "ma-prop", topicId: "ma-prop-truth", level: "advanced",
    build: (rand) => {
      const half = randInt(rand, 3, 9);
      const c = half * half; // x² − ax + c, D = a² − 4c ≤ 0 → |a| ≤ 2·half
      const count = 2 * 2 * half + 1;
      const { choices, answer } = makeChoices(rand, String(count), [
        String(count - 1),
        String(count + 1),
        String(2 * half),
      ]);
      return {
        subjectId: "math", unitId: "ma-prop", topicId: "ma-prop-truth", level: "advanced",
        body: `명제 '어떤 실수 x에 대하여 x² − ax + ${c} < 0 이다' 의 부정이 참이 되게 하는 정수 a 의 개수는?`,
        choices, answerIndex: answer,
        keyConcept: "'어떤 ~이다'의 부정은 '모든 ~이 아니다'. 모든 실수에서 ≥ 0 이려면 판별식 ≤ 0.",
        solutionSteps: [
          `부정: '모든 실수 x에 대하여 x² − ax + ${c} ≥ 0 이다'`,
          `판별식 D = a² − 4 × ${c} ≤ 0`,
          `a² ≤ ${4 * c} → ${-2 * half} ≤ a ≤ ${2 * half}`,
          `정수 a의 개수는 ${count}개`,
        ],
        reviewConcept: "이차식이 항상 0 이상 ⟺ (최고차항 > 0) 그리고 (D ≤ 0)",
        estSeconds: 110,
      };
    },
  },
];

TEMPLATES.push(...COMMON_TEMPLATES);
