/**
 * 대입 학습 보완 프로그램 — 도메인 타입 정의
 *
 * 설계 원칙
 *  - 저작권 문제를 피하기 위해 기출 원문은 저장하지 않는다.
 *    문항은 "유형 태그 + 자체 제작 본문"만 보관한다.
 *  - 모든 학습 판정(승급/하향, 약점 순위)은 규칙 기반으로 계산 가능해야 한다.
 */

export type SubjectId = "korean" | "math" | "english" | "inquiry";

/** 기초 → 심화 → 응용 */
export type Level = "basic" | "advanced" | "applied";

/** 내신 / 모의고사 */
export type ExamType = "school" | "mock";

export type Grade = "고1" | "고2" | "고3" | "N수";

export type GoalType = "suneung" | "naesin" | "both";

/** 학습 세션 길이 모드 */
export type SessionMode = 20 | 50;

// ────────────────────────────────────────────────────────────
// 교육과정 트리: 과목 → 단원 → 유형
// ────────────────────────────────────────────────────────────

export interface Topic {
  id: string;
  unitId: string;
  name: string;
}

export interface Unit {
  id: string;
  subjectId: SubjectId;
  name: string;
  /** 대입에서 차지하는 비중 1(낮음) ~ 5(높음). 약점 우선순위 가중치로 쓰인다. */
  weight: number;
  /**
   * 이 단원을 추천 대상으로 삼을 학년.
   * 비어 있으면 전 학년 공통.
   * 고1에게 미분을, 고3에게 고1 공통수학만을 추천하는 일을 막는다.
   * 자동 추천에만 적용되며, 학습 트랙에서 직접 고르는 것은 언제나 가능하다.
   */
  grades?: Grade[];
  topics: Topic[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  /** 점수 만점 (국·수·탐 100점 환산, 영어는 절대평가지만 100점 기준으로 통일) */
  maxScore: number;
  accent: string;
  units: Unit[];
}

// ────────────────────────────────────────────────────────────
// 문항
// ────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  subjectId: SubjectId;
  unitId: string;
  topicId: string;
  level: Level;
  /** 국어·영어 지문. 없으면 단문 문항 */
  passage?: string;
  body: string;
  choices: string[];
  answerIndex: number;
  /** 핵심 개념 1줄 */
  keyConcept: string;
  /** 단계별 풀이 */
  solutionSteps: string[];
  /** 오답 시 되돌아가 볼 복습 개념 */
  reviewConcept: string;
  estSeconds: number;
  /** 변형 문제인 경우 원본 문항 id */
  variantOf?: string;
}

/**
 * 변형 문항 생성기.
 * DB 문항이 부족할 때 같은 유형의 숫자/조건만 바꿔 새 문항을 만든다.
 */
export interface QuestionTemplate {
  id: string;
  subjectId: SubjectId;
  unitId: string;
  topicId: string;
  level: Level;
  build: (rand: () => number) => Omit<Question, "id" | "variantOf">;
}

// ────────────────────────────────────────────────────────────
// 사용자 상태
// ────────────────────────────────────────────────────────────

export interface Profile {
  grade: Grade;
  goalType: GoalType;
  /** 과목별 목표 점수 */
  targets: Record<SubjectId, number>;
  /** 하루 공부 가능 시간(분) */
  dailyMinutes: number;
  createdAt: string;
}

export interface ScoreRecord {
  id: string;
  subjectId: SubjectId;
  examType: ExamType;
  score: number;
  /** 사용자가 "약하다"고 직접 체크한 단원 */
  wrongUnitIds: string[];
  date: string;
}

export interface MasteryState {
  unitId: string;
  subjectId: SubjectId;
  level: Level;
  /** 연속 정답 수 (3 도달 시 승급) */
  correctStreak: number;
  /** 연속 오답 수 (2 도달 시 하향) */
  wrongStreak: number;
  totalAttempts: number;
  correctAttempts: number;
  updatedAt: string;
}

export interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  subjectId: SubjectId;
  unitId: string;
  topicId: string;
  level: Level;
  chosenIndex: number | null;
  correct: boolean;
  timeSpentSec: number;
  createdAt: string;
}

export interface WrongNote {
  questionId: string;
  subjectId: SubjectId;
  unitId: string;
  topicId: string;
  level: Level;
  wrongCount: number;
  lastWrongAt: string;
  /** 재출제에서 연속 2회 맞히면 해결 처리 */
  resolvedStreak: number;
  resolved: boolean;
  memo: string;
  /** 변형 문항도 복습할 수 있도록 문항 전체를 스냅샷으로 보관 */
  snapshot: Question;
}

export interface StudySession {
  id: string;
  mode: SessionMode;
  subjectId: SubjectId;
  targetUnitIds: string[];
  questions: Question[];
  answers: (number | null)[];
  currentIndex: number;
  startedAt: string;
  finishedAt: string | null;
  /** 문항별 소요 시간(초) */
  spent: number[];
}

export type PlanItemKind = "session" | "review" | "self";

export interface PlanItem {
  id: string;
  kind: PlanItemKind;
  subjectId: SubjectId | null;
  unitId: string | null;
  minutes: number;
  label: string;
  detail: string;
  done: boolean;
}

export interface DailyPlan {
  /** YYYY-MM-DD */
  date: string;
  items: PlanItem[];
  totalMinutes: number;
}

export interface StudyState {
  version: 1;
  profile: Profile | null;
  scores: ScoreRecord[];
  mastery: Record<string, MasteryState>;
  attempts: Attempt[];
  wrongNotes: Record<string, WrongNote>;
  activeSession: StudySession | null;
  lastSession: StudySession | null;
  plans: Record<string, DailyPlan>;
  /** 연속 학습일 계산용 (YYYY-MM-DD 목록) */
  studyDays: string[];
}

// ────────────────────────────────────────────────────────────
// 계산 결과 타입
// ────────────────────────────────────────────────────────────

export interface WeakUnit {
  unitId: string;
  subjectId: SubjectId;
  unitName: string;
  subjectName: string;
  /** 우선순위 점수 (높을수록 먼저 보완) */
  priority: number;
  level: Level;
  accuracy: number | null;
  reasons: string[];
}

export interface SubjectGap {
  subjectId: SubjectId;
  subjectName: string;
  current: number | null;
  target: number;
  gap: number;
}
