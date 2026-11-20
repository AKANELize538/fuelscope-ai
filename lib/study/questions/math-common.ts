import type { Question } from "../types";
import { build, type Draft } from "./helpers";

/**
 * 고1 공통수학 — 함수 · 유리함수 · 무리함수 · 집합과 명제 · 경우의 수
 *
 * 내신 기출에서 반복되는 "유형"만 가져오고, 숫자와 조건은 모두 새로 잡았다.
 * 기출 문항의 문장을 그대로 옮긴 것은 하나도 없다.
 */

const drafts: Draft[] = [
  // ── 함수와 그래프 ────────────────────────────────────────
  {
    id: "mc-func-b1", unit: "ma-func", topic: "ma-func-comp", level: "basic",
    body: "두 함수 f(x) = 2x + 1, g(x) = x − 1 에 대하여 (f∘g)(3)의 값은?",
    choices: ["3", "5", "7", "9"], answer: 1,
    key: "(f∘g)(x) = f(g(x)) — 안쪽 g부터 계산한다.",
    steps: ["g(3) = 3 − 1 = 2", "f(2) = 2×2 + 1 = 5", "따라서 (f∘g)(3) = 5"],
    review: "합성함수의 계산 순서 — f∘g 는 g를 먼저 적용한다.",
  },
  {
    id: "mc-func-b2", unit: "ma-func", topic: "ma-func-inv", level: "basic",
    body: "함수 f(x) = 3x − 2 에 대하여 f⁻¹(4)의 값은?",
    choices: ["1", "2", "4", "10"], answer: 1,
    key: "f⁻¹(k) = a ⟺ f(a) = k",
    steps: ["f⁻¹(4) = a 라 하면 f(a) = 4", "3a − 2 = 4 → 3a = 6", "a = 2"],
    review: "역함수 값은 '어떤 x를 넣어야 그 값이 나오는가'를 묻는 것이다.",
  },
  {
    id: "mc-func-b3", unit: "ma-func", topic: "ma-func-comp", level: "basic",
    body: "집합 X = {1, 2, 3} 에서 X로의 함수 f가 f(1) = 2, f(2) = 3, f(3) = 1 일 때, (f∘f)(1)의 값은?",
    choices: ["1", "2", "3", "4"], answer: 2,
    key: "(f∘f)(1) = f(f(1))",
    steps: ["f(1) = 2", "f(2) = 3", "따라서 (f∘f)(1) = 3"],
    review: "대응 관계로 주어진 합성함수는 화살표를 따라 두 번 이동한다.",
  },
  {
    id: "mc-func-a1", unit: "ma-func", topic: "ma-func-inv", level: "advanced",
    body: "함수 f(x) = ax + b 가 f(1) = 4, f⁻¹(10) = 3 을 만족시킬 때, a + 2b 의 값은? (단, a, b는 상수이다.)",
    choices: ["3", "5", "7", "9"], answer: 1,
    key: "f⁻¹(10) = 3 은 f(3) = 10 과 같은 말이다.",
    steps: [
      "f(1) = a + b = 4",
      "f⁻¹(10) = 3 이므로 f(3) = 3a + b = 10",
      "두 식을 빼면 2a = 6 → a = 3, b = 1",
      "a + 2b = 3 + 2 = 5",
    ],
    review: "역함수 조건은 원래 함수의 조건으로 바꿔 쓰는 것이 첫 단계다.",
  },
  {
    id: "mc-func-a2", unit: "ma-func", topic: "ma-func-comp", level: "advanced",
    body: "두 함수 f(x) = 2x + 1, g(x) = x − 3 에 대하여 (f∘g)(c) = 5 일 때, 상수 c의 값은?",
    choices: ["2", "4", "5", "6"], answer: 2,
    key: "합성함수의 식을 먼저 정리한 뒤 방정식을 푼다.",
    steps: [
      "(f∘g)(x) = f(x−3) = 2(x−3) + 1 = 2x − 5",
      "2c − 5 = 5 → 2c = 10",
      "c = 5",
    ],
    review: "합성함수를 x의 식으로 정리해 두면 여러 문항에 재사용할 수 있다.",
  },
  {
    id: "mc-func-p1", unit: "ma-func", topic: "ma-func-inv", level: "applied",
    body: "실수 전체의 집합에서 정의된 함수 f가 모든 실수 x에 대하여 f(2x − 3) = 4x + 1 을 만족시킨다. f⁻¹(x) = ax + b 일 때, a + b 의 값은? (단, a, b는 상수이다.)",
    choices: ["−3", "−2", "2", "3"], answer: 0,
    key: "2x − 3 = t 로 치환해 f(t)를 t의 식으로 나타낸다.",
    steps: [
      "2x − 3 = t 라 하면 x = (t + 3)/2",
      "f(t) = 4 × (t+3)/2 + 1 = 2t + 6 + 1 = 2t + 7",
      "y = 2x + 7 에서 x = (y − 7)/2 이므로 f⁻¹(x) = x/2 − 7/2",
      "a = 1/2, b = −7/2 → a + b = −3",
    ],
    review: "f(□) = ~ 꼴은 □를 t로 치환해 f의 식을 먼저 복원한다.",
  },
  {
    id: "mc-func-p2", unit: "ma-func", topic: "ma-func-basic", level: "applied",
    body: "집합 X = {1, 2, 3, 4, 5} 에 대하여 세 함수 f, g, h는 X에서 X로의 함수이다. f는 일대일대응, g는 항등함수, h는 상수함수이고 f(1) = g(4) + h(4), f(3) = f(2) + 3 일 때, f(2) + g(4) + h(5) 의 값은?",
    choices: ["4", "5", "6", "7"], answer: 2,
    key: "항등함수는 g(x) = x, 상수함수는 h(x) = c (일정). 일대일대응은 값이 겹치지 않는다.",
    steps: [
      "g(4) = 4 이고 h(x) = c 라 하면 f(1) = 4 + c",
      "f(1)은 X의 원소이므로 4 + c ≤ 5 → c = 1, 즉 f(1) = 5",
      "남은 값은 {1, 2, 3, 4}. f(3) = f(2) + 3 을 만족하는 쌍은 (f(2), f(3)) = (1, 4) 뿐이다",
      "f(2) + g(4) + h(5) = 1 + 4 + 1 = 6",
    ],
    review: "일대일대응 문제는 '값이 X를 벗어날 수 없다'는 제약으로 후보를 좁힌다.",
  },

  // ── 유리함수 ────────────────────────────────────────────
  {
    id: "mc-rat-b1", unit: "ma-rational", topic: "ma-rational-asym", level: "basic",
    body: "유리함수 y = 1/(x − 2) + 3 의 점근선이 두 직선 x = p, y = q 일 때, p + q 의 값은? (단, p, q는 상수이다.)",
    choices: ["1", "3", "5", "6"], answer: 2,
    key: "y = k/(x − p) + q 의 점근선은 x = p, y = q 이다.",
    steps: ["주어진 식에서 p = 2, q = 3", "p + q = 2 + 3 = 5"],
    review: "점근선은 평행이동한 양을 그대로 읽으면 된다.",
  },
  {
    id: "mc-rat-b2", unit: "ma-rational", topic: "ma-rational-calc", level: "basic",
    body: "1/(x + 1) + 1/(x − 1) 을 하나의 분수로 정리한 것은?",
    choices: ["2x/(x² − 1)", "2/(x² − 1)", "2x/(x² + 1)", "x/(x² − 1)"], answer: 0,
    key: "분모가 다른 유리식은 통분해서 더한다.",
    steps: [
      "공통분모는 (x+1)(x−1) = x² − 1",
      "분자는 (x−1) + (x+1) = 2x",
      "따라서 2x/(x² − 1)",
    ],
    review: "유리식의 덧셈 — 통분 후 분자만 더한다.",
  },
  {
    id: "mc-rat-b3", unit: "ma-rational", topic: "ma-rational-asym", level: "basic",
    body: "y = (2x + 1)/(x − 1) 을 y = k/(x − p) + q 꼴로 고쳤을 때, q 의 값은?",
    choices: ["1", "2", "3", "4"], answer: 1,
    key: "분자를 분모의 배수 + 나머지로 쪼갠다.",
    steps: [
      "2x + 1 = 2(x − 1) + 3",
      "y = {2(x−1) + 3}/(x−1) = 2 + 3/(x−1)",
      "따라서 q = 2",
    ],
    review: "분자 차수 = 분모 차수이면 몫이 수평 점근선의 높이가 된다.",
  },
  {
    id: "mc-rat-a1", unit: "ma-rational", topic: "ma-rational-asym", level: "advanced",
    body: "유리함수 y = (3x + 5)/(x − 2) 의 그래프의 점근선이 두 직선 x = a, y = b 일 때, a + b 의 값은? (단, a, b는 상수이다.)",
    choices: ["1", "3", "5", "7"], answer: 2,
    key: "수직 점근선은 분모 = 0, 수평 점근선은 분자·분모의 최고차항 비이다.",
    steps: [
      "3x + 5 = 3(x − 2) + 11 이므로 y = 3 + 11/(x − 2)",
      "점근선은 x = 2, y = 3 → a = 2, b = 3",
      "a + b = 5",
    ],
    review: "(ax+b)/(cx+d) 의 수평 점근선은 y = a/c 이다.",
  },
  {
    id: "mc-rat-a2", unit: "ma-rational", topic: "ma-rational-graph", level: "advanced",
    body: "다음 중 그래프를 평행이동하여 함수 y = 1/x 의 그래프와 완전히 겹치는 것은?",
    choices: [
      "y = (2x − 3)/(x − 2)",
      "y = (3x + 1)/(x + 1)",
      "y = (x + 3)/(x + 1)",
      "y = (5x + 7)/(x + 1)",
    ], answer: 0,
    key: "y = k/(x−p) + q 로 고쳤을 때 k = 1 이어야 y = 1/x 와 겹친다.",
    steps: [
      "① 2x−3 = 2(x−2) + 1 → y = 2 + 1/(x−2) → k = 1 ✓",
      "② 3x+1 = 3(x+1) − 2 → k = −2",
      "③ x+3 = (x+1) + 2 → k = 2",
      "④ 5x+7 = 5(x+1) + 2 → k = 2",
    ],
    review: "평행이동은 k를 바꾸지 못한다. k가 같아야 겹친다.",
  },
  {
    id: "mc-rat-p1", unit: "ma-rational", topic: "ma-rational-graph", level: "applied",
    body: "유리함수 y = (−2x − 2k + 9)/(x + 1) 의 그래프가 제1사분면을 지나도록 하는 가장 큰 자연수 k 의 값은?",
    choices: ["3", "4", "5", "6"], answer: 1,
    key: "표준형으로 고쳐 점근선을 찾고, x = 0 근처에서 y가 양수가 될 수 있는지 본다.",
    steps: [
      "−2x − 2k + 9 = −2(x+1) + (11 − 2k) 이므로 y = −2 + (11−2k)/(x+1)",
      "점근선은 x = −1, y = −2",
      "x > 0 에서 y는 감소하므로 최댓값은 x → 0⁺ 일 때의 −2 + (11−2k)",
      "−2 + (11 − 2k) > 0 → 2k < 9 → k ≤ 4",
      "가장 큰 자연수 k = 4",
    ],
    review: "사분면 통과 문제 — 점근선을 그리고 x = 0 에서의 값을 확인한다.",
  },
  {
    id: "mc-rat-p2", unit: "ma-rational", topic: "ma-rational-graph", level: "applied",
    body: "어떤 유리함수의 그래프가 점 (0, 4)를 지나고, 두 직선 y = x − 1 과 y = −x + 3 에 대하여 각각 대칭이다. 이 함수를 y = (ax + b)/(x + c) 꼴로 나타낼 때, a + b + c 의 값은? (단, a, b, c는 상수이다.)",
    choices: ["−9", "−7", "−5", "−3"], answer: 0,
    key: "두 대칭축의 교점이 곧 유리함수 그래프의 대칭 중심(점근선의 교점)이다.",
    steps: [
      "x − 1 = −x + 3 → x = 2, y = 1 이므로 중심은 (2, 1)",
      "따라서 y = k/(x − 2) + 1 로 둘 수 있다",
      "(0, 4) 대입: 4 = k/(−2) + 1 → k = −6",
      "y = −6/(x−2) + 1 = (x − 8)/(x − 2) → a = 1, b = −8, c = −2",
      "a + b + c = 1 − 8 − 2 = −9",
    ],
    review: "유리함수는 점근선의 교점에 대해 점대칭이고, 기울기 ±1인 두 직선에 대해 선대칭이다.",
  },

  // ── 무리함수 ────────────────────────────────────────────
  {
    id: "mc-irr-b1", unit: "ma-irrational", topic: "ma-irr-domain", level: "basic",
    body: "무리함수 y = √(x − 3) + 2 의 정의역은?",
    choices: ["{x | x ≥ 2}", "{x | x ≥ 3}", "{x | x ≤ 3}", "{x | x ≥ 0}"], answer: 1,
    key: "근호 안은 0 이상이어야 한다.",
    steps: ["x − 3 ≥ 0", "x ≥ 3", "따라서 정의역은 {x | x ≥ 3}"],
    review: "무리함수의 정의역은 (근호 안) ≥ 0 에서 나온다.",
  },
  {
    id: "mc-irr-b2", unit: "ma-irrational", topic: "ma-irr-calc", level: "basic",
    body: "(√(x + 2) + √(x − 1))(√(x + 2) − √(x − 1)) 을 간단히 하면?",
    choices: ["1", "3", "2x + 1", "3x"], answer: 1,
    key: "합차 공식 (A + B)(A − B) = A² − B²",
    steps: [
      "A = √(x+2), B = √(x−1) 로 보면 A² − B²",
      "= (x + 2) − (x − 1)",
      "= 3",
    ],
    review: "무리식의 곱은 합차 공식을 쓰면 근호가 한 번에 사라진다.",
  },
  {
    id: "mc-irr-b3", unit: "ma-irrational", topic: "ma-irr-graph", level: "basic",
    body: "함수 y = √(x + 1) 의 그래프는 y = √x 의 그래프를 x축의 방향으로 얼마만큼 평행이동한 것인가?",
    choices: ["−1", "1", "−1/2", "2"], answer: 0,
    key: "y = f(x − m) 은 x축 방향으로 m 만큼 평행이동한 것이다.",
    steps: [
      "√(x + 1) = √(x − (−1))",
      "따라서 m = −1",
      "즉 x축 방향으로 −1 (왼쪽으로 1) 만큼 이동한 것이다",
    ],
    review: "괄호 안의 부호와 이동 방향은 반대다.",
  },
  {
    id: "mc-irr-a1", unit: "ma-irrational", topic: "ma-irr-domain", level: "advanced",
    body: "함수 y = √(−x + a) + b 의 정의역이 {x | x ≤ 4} 이고 치역이 {y | y ≥ −1} 일 때, a + b 의 값은? (단, a, b는 상수이다.)",
    choices: ["2", "3", "4", "5"], answer: 1,
    key: "근호 앞의 부호가 −이면 정의역은 x ≤ (상수) 꼴이 되고, 치역의 끝값이 b 이다.",
    steps: [
      "−x + a ≥ 0 → x ≤ a 이므로 a = 4",
      "√(…) ≥ 0 이므로 y ≥ b, 즉 b = −1",
      "a + b = 4 + (−1) = 3",
    ],
    review: "무리함수의 치역의 경계값은 평행이동한 양 b 그 자체다.",
  },
  {
    id: "mc-irr-a2", unit: "ma-irrational", topic: "ma-irr-calc", level: "advanced",
    body: "x = 5 일 때, 1/(√(x + 4) + √(x − 1)) 의 값은?",
    choices: ["1/5", "1/4", "1/3", "1"], answer: 0,
    key: "분모에 무리식이 있으면 켤레를 곱해 유리화한다.",
    steps: [
      "분모·분자에 √(x+4) − √(x−1) 을 곱한다",
      "분모는 (x+4) − (x−1) = 5 가 되어 {√(x+4) − √(x−1)}/5",
      "x = 5 를 대입하면 (√9 − √4)/5 = (3 − 2)/5",
      "= 1/5",
    ],
    review: "분모의 유리화 — 켤레를 곱하면 분모가 유리수가 된다.",
  },
  {
    id: "mc-irr-p1", unit: "ma-irrational", topic: "ma-irr-graph", level: "applied",
    body: "무리함수 y = √(ax + b) + c 의 그래프가 시작점 (−3, −1)에서 출발하여 점 (1, 1)을 지난다. a + b + c 의 값은? (단, a, b, c는 상수이고 a > 0 이다.)",
    choices: ["1", "3", "5", "7"], answer: 1,
    key: "시작점은 근호 안이 0이 되는 지점이고, 그때의 y값이 c 이다.",
    steps: [
      "시작점의 y좌표가 c 이므로 c = −1",
      "시작점의 x좌표에서 ax + b = 0 → −3a + b = 0 → b = 3a",
      "(1, 1) 대입: 1 = √(a + b) − 1 → √(a + b) = 2 → a + b = 4",
      "a + 3a = 4 → a = 1, b = 3",
      "a + b + c = 1 + 3 − 1 = 3",
    ],
    review: "그래프 해석 문제 — 시작점 좌표가 두 개의 식을 바로 준다.",
  },
  {
    id: "mc-irr-p2", unit: "ma-irrational", topic: "ma-irr-graph", level: "applied",
    body: "함수 f(x) = √(x − 2) + 2 에 대하여 y = f(x) 의 그래프와 y = f⁻¹(x) 의 그래프가 만나는 두 점 사이의 거리는?",
    choices: ["1", "√2", "2", "2√2"], answer: 1,
    key: "y = f(x) 와 y = f⁻¹(x) 의 교점은 직선 y = x 위에 있다.",
    steps: [
      "f(x) = x 를 풀면 된다: √(x − 2) + 2 = x",
      "√(x − 2) = x − 2 에서 t = x − 2 (t ≥ 0) 로 두면 √t = t",
      "t = 0 또는 t = 1 → x = 2 또는 x = 3",
      "교점은 (2, 2), (3, 3) 이므로 거리는 √(1² + 1²) = √2",
    ],
    review: "역함수와의 교점은 y = x 위에서 찾는다(단, 증가함수일 때).",
  },

  // ── 집합과 명제 ─────────────────────────────────────────
  {
    id: "mc-prop-b1", unit: "ma-prop", topic: "ma-prop-truth", level: "basic",
    body: "명제 'x = 2 이면 x² = 4 이다' 의 역은?",
    choices: [
      "x² = 4 이면 x = 2 이다.",
      "x ≠ 2 이면 x² ≠ 4 이다.",
      "x² ≠ 4 이면 x ≠ 2 이다.",
      "x = 2 이면 x² ≠ 4 이다.",
    ], answer: 0,
    key: "'p이면 q'의 역은 'q이면 p'이다.",
    steps: [
      "p: x = 2, q: x² = 4",
      "역은 가정과 결론을 맞바꾼 'q이면 p'",
      "따라서 'x² = 4 이면 x = 2 이다'",
    ],
    review: "역(q→p) / 이(~p→~q) / 대우(~q→~p) 의 구분",
  },
  {
    id: "mc-prop-b2", unit: "ma-prop", topic: "ma-prop-truth", level: "basic",
    body: "명제 'p이면 q이다' 가 참일 때, 반드시 참이라고 할 수 있는 것은?",
    choices: ["역", "이", "대우", "부정"], answer: 2,
    key: "명제와 그 대우는 참·거짓이 항상 일치한다.",
    steps: [
      "역과 이는 원래 명제와 참·거짓이 다를 수 있다",
      "대우 '~q이면 ~p이다' 는 원래 명제와 항상 같은 참·거짓을 가진다",
      "따라서 대우가 반드시 참이다",
    ],
    review: "대우를 이용한 증명이 가능한 이유가 바로 이것이다.",
  },
  {
    id: "mc-prop-b3", unit: "ma-prop", topic: "ma-prop-truth", level: "basic",
    body: "명제 '모든 실수 x에 대하여 x² ≥ 0 이다' 의 부정은?",
    choices: [
      "모든 실수 x에 대하여 x² < 0 이다.",
      "어떤 실수 x에 대하여 x² < 0 이다.",
      "어떤 실수 x에 대하여 x² ≥ 0 이다.",
      "모든 실수 x에 대하여 x² ≤ 0 이다.",
    ], answer: 1,
    key: "'모든'의 부정은 '어떤', 조건도 함께 부정한다.",
    steps: [
      "'모든 ~이다' 의 부정은 '어떤 ~이 아니다'",
      "x² ≥ 0 의 부정은 x² < 0",
      "따라서 '어떤 실수 x에 대하여 x² < 0 이다'",
    ],
    review: "한정사(모든/어떤)와 조건을 모두 뒤집어야 한다.",
  },
  {
    id: "mc-prop-a1", unit: "ma-prop", topic: "ma-prop-cond", level: "advanced",
    body: "두 조건 p, q의 진리집합을 각각 P, Q라 하자. p가 q이기 위한 충분조건일 때, 항상 옳은 것은?",
    choices: ["P ⊂ Q", "Q ⊂ P", "P ∩ Q = ∅", "P = Qᶜ"], answer: 0,
    key: "p ⇒ q 이면 진리집합은 P ⊂ Q 이다.",
    steps: [
      "p가 q이기 위한 충분조건 ⟺ 명제 p → q 가 참",
      "p를 만족하는 모든 원소가 q도 만족한다는 뜻",
      "따라서 P ⊂ Q",
    ],
    review: "화살표 방향과 포함 방향은 같다. p ⇒ q ⟺ P ⊂ Q",
  },
  {
    id: "mc-prop-a2", unit: "ma-prop", topic: "ma-prop-truth", level: "advanced",
    body: "명제 '어떤 실수 x에 대하여 x² − ax + 9 < 0 이다' 의 부정이 참이 되게 하는 정수 a 의 개수는?",
    choices: ["11", "12", "13", "14"], answer: 2,
    key: "'어떤 ~이다'의 부정은 '모든 ~이 아니다'. 모든 실수에서 ≥ 0 이려면 판별식 ≤ 0.",
    steps: [
      "부정: '모든 실수 x에 대하여 x² − ax + 9 ≥ 0 이다'",
      "최고차항이 양수이므로 판별식 D ≤ 0 이면 된다",
      "D = a² − 4×9 = a² − 36 ≤ 0 → −6 ≤ a ≤ 6",
      "정수 a는 −6부터 6까지 13개",
    ],
    review: "이차식이 항상 0 이상 ⟺ (최고차항 > 0) 그리고 (D ≤ 0)",
  },
  {
    id: "mc-prop-p1", unit: "ma-prop", topic: "ma-prop-proof", level: "applied",
    body: "a > 2, b > 2 이고 ab − 2a − 2b = 5 일 때, a + b 의 최솟값은?",
    choices: ["8", "9", "10", "12"], answer: 2,
    key: "곱이 일정한 두 양수의 합은 산술평균 ≥ 기하평균으로 최솟값을 찾는다.",
    steps: [
      "ab − 2a − 2b + 4 = 9 이므로 (a − 2)(b − 2) = 9",
      "a − 2 > 0, b − 2 > 0 이므로 (a−2) + (b−2) ≥ 2√9 = 6",
      "a + b − 4 ≥ 6 → a + b ≥ 10",
      "등호는 a − 2 = b − 2 = 3, 즉 a = b = 5 일 때 성립",
    ],
    review: "산술·기하평균 — 곱이 상수가 되도록 식을 (a−k)(b−k) 꼴로 묶는 것이 핵심이다.",
  },
  {
    id: "mc-prop-p2", unit: "ma-prop", topic: "ma-prop-cond", level: "applied",
    body: "세 조건 p: −1 ≤ x < 4 또는 x ≥ 9, q: x > a, r: x ≥ b 에 대하여 두 명제 p → q, r → p 가 모두 참이 되도록 하는 정수 a 의 최댓값과 정수 b 의 최솟값의 합은?",
    choices: ["5", "6", "7", "8"], answer: 2,
    key: "명제가 참 ⟺ 진리집합의 포함 관계. 수직선을 그려 확인한다.",
    steps: [
      "P = [−1, 4) ∪ [9, ∞), Q = (a, ∞), R = [b, ∞)",
      "p → q 참 ⟺ P ⊂ Q ⟺ a < −1 → 정수 a의 최댓값은 −2",
      "r → p 참 ⟺ R ⊂ P. [b, ∞) 가 P에 들어가려면 b ≥ 9 → 정수 b의 최솟값은 9",
      "−2 + 9 = 7",
    ],
    review: "경계값이 포함되는지(≤ 인지 < 인지) 반드시 따로 확인한다.",
  },

  // ── 경우의 수 ───────────────────────────────────────────
  {
    id: "mc-cnt-b1", unit: "ma-count", topic: "ma-count-perm", level: "basic",
    body: "₅P₂ 의 값은?",
    choices: ["10", "20", "25", "120"], answer: 1,
    key: "ₙPᵣ = n(n−1)…(r개를 연달아 곱한다)",
    steps: ["₅P₂ = 5 × 4", "= 20"],
    review: "순열은 n부터 r개를 내려가며 곱한다.",
  },
  {
    id: "mc-cnt-b2", unit: "ma-count", topic: "ma-count-comb", level: "basic",
    body: "₆C₂ 의 값은?",
    choices: ["12", "15", "30", "36"], answer: 1,
    key: "ₙCᵣ = ₙPᵣ / r!",
    steps: ["₆C₂ = (6 × 5) ÷ (2 × 1)", "= 30 ÷ 2 = 15"],
    review: "조합은 순열을 r! 로 나눈 것이다(순서를 따지지 않으므로).",
  },
  {
    id: "mc-cnt-b3", unit: "ma-count", topic: "ma-count-perm", level: "basic",
    body: "서로 다른 4개의 문자 중 3개를 택해 일렬로 나열하는 경우의 수는?",
    choices: ["12", "24", "36", "64"], answer: 1,
    key: "택해서 '나열'하면 순열이다.",
    steps: ["₄P₃ = 4 × 3 × 2", "= 24"],
    review: "나열·줄세우기·자리배치 = 순열",
  },
  {
    id: "mc-cnt-a1", unit: "ma-count", topic: "ma-count-comb", level: "advanced",
    body: "등식 ₆P₄ = n × ₆C₄ 를 만족시키는 자연수 n 의 값은?",
    choices: ["6", "12", "24", "30"], answer: 2,
    key: "ₙPᵣ = r! × ₙCᵣ",
    steps: [
      "₆P₄ = 6 × 5 × 4 × 3 = 360",
      "₆C₄ = ₆C₂ = 15",
      "n = 360 ÷ 15 = 24 ( = 4! )",
    ],
    review: "순열 = 조합 × r! — 고른 뒤 줄 세우는 것으로 이해한다.",
  },
  {
    id: "mc-cnt-a2", unit: "ma-count", topic: "ma-count-cond", level: "advanced",
    body: "5명을 일렬로 세울 때, 특정한 2명이 서로 이웃하지 않도록 세우는 경우의 수는?",
    choices: ["48", "60", "72", "96"], answer: 2,
    key: "'이웃하지 않는다' = 전체 − 이웃하는 경우",
    steps: [
      "전체 경우의 수 = 5! = 120",
      "두 사람을 한 덩어리로 묶으면 4! × 2! = 24 × 2 = 48",
      "120 − 48 = 72",
    ],
    review: "여사건 — 부정 조건은 전체에서 빼는 편이 빠르다.",
  },
  {
    id: "mc-cnt-p1", unit: "ma-count", topic: "ma-count-cond", level: "applied",
    body: "1, 2, 3, 4, 5 중에서 서로 다른 3개를 택하여 만든 세 자리 자연수 중 3의 배수의 개수는?",
    choices: ["18", "20", "24", "30"], answer: 2,
    key: "각 자리 숫자의 합이 3의 배수이면 그 수는 3의 배수이다.",
    steps: [
      "세 수의 합이 3의 배수가 되는 조합을 찾는다",
      "{1,2,3}=6, {1,3,5}=9, {2,3,4}=9, {3,4,5}=12 → 4가지",
      "0이 없으므로 각 조합마다 3! = 6개씩 만들 수 있다",
      "4 × 6 = 24",
    ],
    review: "배수 판정 — 3의 배수는 '각 자리 수의 합'으로 판단한다.",
  },
  {
    id: "mc-cnt-p2", unit: "ma-count", topic: "ma-count-cond", level: "applied",
    body: "서로 다른 두 개의 주사위를 던져 나온 눈의 수를 각각 a, b 라 할 때, a + b + ab 의 값이 짝수가 되는 경우의 수는?",
    choices: ["6", "9", "12", "18"], answer: 1,
    key: "a + b + ab = (a + 1)(b + 1) − 1 로 묶으면 홀짝 판정이 쉬워진다.",
    steps: [
      "a + b + ab + 1 = (a+1)(b+1) 이므로 a+b+ab = (a+1)(b+1) − 1",
      "이 값이 짝수 ⟺ (a+1)(b+1) 이 홀수 ⟺ a+1, b+1 이 모두 홀수",
      "즉 a, b 가 모두 짝수여야 한다",
      "짝수는 2, 4, 6 의 3가지씩이므로 3 × 3 = 9",
    ],
    review: "식을 인수분해해 홀짝을 판정하는 것이 이 유형의 핵심이다.",
  },
];

export const MATH_COMMON_QUESTIONS: Question[] = build("math", drafts);
