import type { Grade, Subject, SubjectId, Topic, Unit } from "./types";

/**
 * 대입 준비에 필요한 학습 경로만 담은 교육과정 트리.
 *
 * weight = 대입에서의 비중(1~5). 약점 우선순위를 계산할 때 곱해진다.
 * 진로·적성 추천이나 대학 합격 예측에는 일절 쓰이지 않는다.
 */

type TopicSeed = [id: string, name: string];
type UnitSeed = [
  id: string,
  name: string,
  weight: number,
  topics: TopicSeed[],
  grades?: Grade[],
];

function buildUnits(subjectId: SubjectId, seeds: UnitSeed[]): Unit[] {
  return seeds.map(([id, name, weight, topicSeeds, grades]) => {
    const topics: Topic[] = topicSeeds.map(([tid, tname]) => ({
      id: tid,
      unitId: id,
      name: tname,
    }));
    return { id, subjectId, name, weight, grades, topics };
  });
}

/** 고1 공통수학 — 주로 고1 내신 범위 */
const G1: Grade[] = ["고1", "고2"];
/** 수학Ⅰ·Ⅱ·확률과 통계 — 고2 이후 */
const G2: Grade[] = ["고2", "고3", "N수"];

export const SUBJECTS: Subject[] = [
  {
    id: "korean",
    name: "국어",
    maxScore: 100,
    accent: "sky",
    units: buildUnits("korean", [
      ["ko-read-sci", "독서 · 과학기술", 5, [
        ["ko-read-sci-detail", "세부 정보 파악"],
        ["ko-read-sci-infer", "추론적 이해"],
        ["ko-read-sci-apply", "구체적 상황 적용"],
      ]],
      ["ko-read-hum", "독서 · 인문사회", 5, [
        ["ko-read-hum-view", "관점 비교"],
        ["ko-read-hum-infer", "생략된 정보 추론"],
      ]],
      ["ko-lit-modern", "문학 · 현대문학", 4, [
        ["ko-lit-modern-express", "표현상 특징"],
        ["ko-lit-modern-theme", "화자·정서 파악"],
      ]],
      ["ko-lit-classic", "문학 · 고전문학", 4, [
        ["ko-lit-classic-word", "고어 의미 파악"],
        ["ko-lit-classic-theme", "주제·태도 파악"],
      ]],
      ["ko-media", "언어와 매체", 3, [
        ["ko-media-grammar", "음운·형태론"],
        ["ko-media-sentence", "문장 성분·높임"],
      ]],
      ["ko-speech", "화법과 작문", 3, [
        ["ko-speech-plan", "글쓰기 계획·고쳐쓰기"],
      ]],
      ["ko-nego", "화법 · 협상", 4, [
        ["ko-nego-strategy", "협상 전략 파악"],
        ["ko-nego-attitude", "협상 태도 분류"],
        ["ko-nego-agree", "합의 내용 정리"],
      ]],
      ["ko-read-law", "독서 · 법과 제도", 5, [
        ["ko-read-law-concept", "요건·개념 관계 파악"],
        ["ko-read-law-case", "사례 적용"],
        ["ko-read-law-word", "문맥상 어휘 의미"],
      ]],
      ["ko-lit-pair", "문학 · 갈래 복합", 5, [
        ["ko-lit-pair-common", "두 작품의 공통점"],
        ["ko-lit-pair-diff", "두 작품의 차이점"],
        ["ko-lit-pair-view", "외적 준거에 따른 감상"],
      ]],
    ]),
  },
  {
    id: "math",
    name: "수학",
    maxScore: 100,
    accent: "emerald",
    units: buildUnits("math", [
      ["ma-func", "함수와 그래프", 5, [
        ["ma-func-basic", "함수의 뜻과 종류"],
        ["ma-func-comp", "합성함수"],
        ["ma-func-inv", "역함수"],
      ], G1],
      ["ma-rational", "유리함수", 5, [
        ["ma-rational-calc", "유리식의 계산"],
        ["ma-rational-asym", "점근선과 평행이동"],
        ["ma-rational-graph", "그래프의 개형과 대칭"],
      ], G1],
      ["ma-irrational", "무리함수", 5, [
        ["ma-irr-calc", "무리식의 계산"],
        ["ma-irr-domain", "정의역과 치역"],
        ["ma-irr-graph", "그래프와 역함수"],
      ], G1],
      ["ma-prop", "집합과 명제", 4, [
        ["ma-prop-truth", "명제의 참·거짓과 역·대우"],
        ["ma-prop-cond", "필요조건과 충분조건"],
        ["ma-prop-proof", "증명과 절대부등식"],
      ], G1],
      ["ma-count", "경우의 수", 4, [
        ["ma-count-perm", "순열"],
        ["ma-count-comb", "조합"],
        ["ma-count-cond", "조건이 있는 배열"],
      ], G1],
      ["ma-seq", "수열", 5, [
        ["ma-seq-arith", "등차수열"],
        ["ma-seq-geo", "등비수열"],
        ["ma-seq-sigma", "시그마와 합"],
      ], G2],
      ["ma-explog", "지수와 로그", 4, [
        ["ma-explog-law", "지수·로그 법칙"],
        ["ma-explog-eq", "지수·로그 방정식"],
      ], G2],
      ["ma-diff", "미분", 5, [
        ["ma-diff-basic", "도함수 계산"],
        ["ma-diff-tangent", "접선의 방정식"],
        ["ma-diff-extreme", "증가·감소와 극값"],
      ], G2],
      ["ma-integral", "적분", 5, [
        ["ma-integral-basic", "부정적분·정적분"],
        ["ma-integral-area", "넓이 활용"],
      ], G2],
      ["ma-trig", "삼각함수", 4, [
        ["ma-trig-value", "삼각함수의 값"],
        ["ma-trig-graph", "그래프와 주기"],
      ], G2],
      ["ma-prob", "확률과 통계", 4, [
        ["ma-prob-count", "경우의 수·조합"],
        ["ma-prob-cond", "조건부확률"],
      ], G2],
    ]),
  },
  {
    id: "english",
    name: "영어",
    maxScore: 100,
    accent: "violet",
    units: buildUnits("english", [
      ["en-blank", "빈칸 추론", 5, [
        ["en-blank-logic", "논리 흐름 추론"],
        ["en-blank-para", "재진술 단서 활용"],
      ]],
      ["en-main", "주제 · 요지 · 제목", 4, [
        ["en-main-idea", "중심 내용 파악"],
        ["en-main-title", "제목 추론"],
      ]],
      ["en-order", "순서 · 삽입", 5, [
        ["en-order-seq", "글의 순서"],
        ["en-order-insert", "문장 삽입"],
      ]],
      ["en-grammar", "어법 · 어휘", 4, [
        ["en-grammar-form", "동사 형태·수일치"],
        ["en-grammar-word", "문맥상 어휘"],
      ]],
      ["en-imply", "함축 의미 · 심경", 3, [
        ["en-imply-meaning", "밑줄 함축 의미"],
      ]],
      ["en-detail", "세부 내용 · 도표", 3, [
        ["en-detail-match", "일치·불일치"],
      ]],
    ]),
  },
  {
    id: "inquiry",
    name: "탐구",
    maxScore: 50,
    accent: "amber",
    units: buildUnits("inquiry", [
      ["in-soc-culture", "사회·문화 · 문화와 사회", 4, [
        ["in-soc-culture-view", "문화 이해 관점"],
        ["in-soc-culture-change", "문화 변동"],
      ], G2],
      ["in-soc-method", "사회·문화 · 탐구 방법", 5, [
        ["in-soc-method-type", "양적·질적 연구"],
        ["in-soc-method-data", "자료 수집 방법"],
      ], G2],
      ["in-life-gene", "생명과학 · 유전", 5, [
        ["in-life-gene-cross", "가계도·교배 분석"],
        ["in-life-gene-mut", "돌연변이"],
      ], G2],
      ["in-life-home", "생명과학 · 항상성", 4, [
        ["in-life-home-nerve", "신경계 흥분 전도"],
        ["in-life-home-horm", "호르몬과 조절"],
      ], G2],
    ]),
  },
];

// ────────────────────────────────────────────────────────────
// 조회 헬퍼
// ────────────────────────────────────────────────────────────

const SUBJECT_MAP = new Map<SubjectId, Subject>(SUBJECTS.map((s) => [s.id, s]));

const UNIT_MAP = new Map<string, Unit>();
const TOPIC_MAP = new Map<string, Topic>();
for (const subject of SUBJECTS) {
  for (const unit of subject.units) {
    UNIT_MAP.set(unit.id, unit);
    for (const topic of unit.topics) TOPIC_MAP.set(topic.id, topic);
  }
}

export const SUBJECT_IDS: SubjectId[] = SUBJECTS.map((s) => s.id);

export function getSubject(id: SubjectId): Subject {
  const found = SUBJECT_MAP.get(id);
  if (!found) throw new Error(`알 수 없는 과목: ${id}`);
  return found;
}

export function getUnit(id: string): Unit | undefined {
  return UNIT_MAP.get(id);
}

export function getTopic(id: string): Topic | undefined {
  return TOPIC_MAP.get(id);
}

export function subjectName(id: SubjectId): string {
  return SUBJECT_MAP.get(id)?.name ?? id;
}

export function unitName(id: string): string {
  return UNIT_MAP.get(id)?.name ?? id;
}

export function topicName(id: string): string {
  return TOPIC_MAP.get(id)?.name ?? id;
}

export function allUnits(): Unit[] {
  return Array.from(UNIT_MAP.values());
}

/**
 * 해당 학년에게 자동 추천할 단원인지 판정한다.
 * grades가 비어 있으면 전 학년 공통 단원이다.
 */
export function unitAppliesToGrade(unit: Unit, grade: Grade | null): boolean {
  if (!unit.grades || unit.grades.length === 0) return true;
  if (grade === null) return true;
  return unit.grades.includes(grade);
}

/** 해당 학년이 학습할 단원만 추린다. */
export function unitsForGrade(grade: Grade | null): Unit[] {
  return allUnits().filter((u) => unitAppliesToGrade(u, grade));
}

/** 해당 학년이 학습할 단원이 하나라도 있는 과목만 추린다. */
export function subjectsForGrade(grade: Grade | null): Subject[] {
  return SUBJECTS.map((s) => ({
    ...s,
    units: s.units.filter((u) => unitAppliesToGrade(u, grade)),
  })).filter((s) => s.units.length > 0);
}

export const LEVEL_LABEL: Record<"basic" | "advanced" | "applied", string> = {
  basic: "기초",
  advanced: "심화",
  applied: "응용",
};

export const LEVEL_ORDER = ["basic", "advanced", "applied"] as const;

export const EXAM_LABEL: Record<"school" | "mock", string> = {
  school: "내신",
  mock: "모의고사",
};
