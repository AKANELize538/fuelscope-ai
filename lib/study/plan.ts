import { LEVEL_LABEL, subjectName, unitName } from "./curriculum";
import { topWeakUnits } from "./diagnosis";
import { todayKey } from "./storage";
import type { DailyPlan, PlanItem, StudyState } from "./types";

/**
 * 제로·저비용 학습 로드맵.
 *
 * 핵심 원칙: 사용자가 입력한 "하루 가능 시간"을 절대 넘지 않는다.
 * 비현실적인 계획은 지키지 못하고, 지키지 못한 계획은 학습을 멈추게 만든다.
 *
 *   가능 시간 ─┬─ 70% : 약점 단원 학습 세션
 *              ├─ 20% : 어제 오답 복습
 *              └─ 10% : 자율(암기·EBS 등 외부 자료)
 */

const SESSION_RATIO = 0.7;
const REVIEW_RATIO = 0.2;

/** 세션 길이는 20분 또는 50분 둘 중 하나로만 배정한다. */
function fitSessions(minutes: number): (20 | 50)[] {
  const out: (20 | 50)[] = [];
  let left = minutes;
  while (left >= 50) {
    out.push(50);
    left -= 50;
  }
  while (left >= 20) {
    out.push(20);
    left -= 20;
  }
  // 아무것도 못 넣을 만큼 시간이 짧으면 최소 한 세트는 보장한다.
  if (out.length === 0 && minutes > 0) out.push(20);
  return out;
}

export function buildDailyPlan(state: StudyState, date = todayKey()): DailyPlan {
  const daily = state.profile?.dailyMinutes ?? 60;
  const weak = topWeakUnits(state, 3);
  const items: PlanItem[] = [];

  const sessionBudget = Math.round(daily * SESSION_RATIO);
  const reviewBudget = Math.round(daily * REVIEW_RATIO);
  const slots = fitSessions(sessionBudget);

  slots.forEach((minutes, i) => {
    const target = weak[i % Math.max(1, weak.length)];
    if (!target) return;
    items.push({
      id: `${date}-session-${i}`,
      kind: "session",
      subjectId: target.subjectId,
      unitId: target.unitId,
      minutes,
      label: `${subjectName(target.subjectId)} · ${unitName(target.unitId)}`,
      detail: `${LEVEL_LABEL[target.level]} 단계 · ${minutes}분 세트`,
      done: false,
    });
  });

  const openNotes = Object.values(state.wrongNotes).filter((n) => !n.resolved);
  if (openNotes.length > 0 && reviewBudget > 0) {
    items.push({
      id: `${date}-review`,
      kind: "review",
      subjectId: null,
      unitId: null,
      minutes: reviewBudget,
      label: "오답 노트 복습",
      detail: `해결되지 않은 오답 ${openNotes.length}문항`,
      done: false,
    });
  }

  const usedMinutes = items.reduce((sum, i) => sum + i.minutes, 0);
  const remain = daily - usedMinutes;
  if (remain >= 10) {
    items.push({
      id: `${date}-self`,
      kind: "self",
      subjectId: null,
      unitId: null,
      minutes: remain,
      label: "자율 학습",
      detail: "영어 단어 · EBS 강의 등 외부 무료 자료",
      done: false,
    });
  }

  return { date, items, totalMinutes: daily };
}

/** 저장된 계획이 있으면 완료 표시를 유지하고, 없으면 새로 만든다. */
export function ensurePlan(state: StudyState, date = todayKey()): DailyPlan {
  const stored = state.plans[date];
  const fresh = buildDailyPlan(state, date);
  if (!stored) return fresh;

  const doneIds = new Set(stored.items.filter((i) => i.done).map((i) => i.id));
  return {
    ...fresh,
    items: fresh.items.map((i) => (doneIds.has(i.id) ? { ...i, done: true } : i)),
  };
}

/** 4주 로드맵 — 주차별로 어떤 단원을 어느 단계까지 올릴지 보여 준다. */
export interface RoadmapWeek {
  week: number;
  label: string;
  focus: { subjectId: string; unitId: string; from: string; to: string }[];
  minutesPerWeek: number;
}

export function buildRoadmap(state: StudyState, weeks = 4): RoadmapWeek[] {
  const daily = state.profile?.dailyMinutes ?? 60;
  const weak = topWeakUnits(state, 6);
  const out: RoadmapWeek[] = [];

  for (let w = 0; w < weeks; w++) {
    const slice = weak.slice(w % 2 === 0 ? 0 : 1, (w % 2 === 0 ? 0 : 1) + 3);
    out.push({
      week: w + 1,
      label: `${w + 1}주차`,
      minutesPerWeek: daily * 7,
      focus: slice.map((t) => {
        const from = LEVEL_LABEL[t.level];
        const to =
          t.level === "basic" ? "심화" : t.level === "advanced" ? "응용" : "응용 유지";
        return {
          subjectId: t.subjectId,
          unitId: t.unitId,
          from,
          to: w === 0 ? from : to,
        };
      }),
    });
  }
  return out;
}
