import type { StudyState } from "./types";

export const STORAGE_KEY = "fuelscope.study.v1";

export function emptyState(): StudyState {
  return {
    version: 1,
    profile: null,
    scores: [],
    mastery: {},
    attempts: [],
    wrongNotes: {},
    activeSession: null,
    lastSession: null,
    plans: {},
    studyDays: [],
  };
}

/** localStorage는 브라우저에만 있으므로 서버 렌더링 중에는 빈 상태를 쓴다. */
export function loadState(): StudyState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    if (parsed.version !== 1) return emptyState();
    // 저장 구조가 바뀌어도 앱이 죽지 않도록 빈 상태 위에 덮어쓴다.
    return { ...emptyState(), ...parsed, version: 1 };
  } catch {
    return emptyState();
  }
}

export function saveState(state: StudyState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 저장 공간이 꽉 찼거나 사생활 보호 모드인 경우 — 학습은 계속 진행되게 둔다.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 해당 날짜가 속한 주의 월요일 */
export function weekStartKey(d: Date = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (copy.getDay() + 6) % 7; // 월요일 = 0
  copy.setDate(copy.getDate() - dow);
  return todayKey(copy);
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
