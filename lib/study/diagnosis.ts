import { SUBJECTS, getSubject, subjectName, unitName } from "./curriculum";
import { questionCountByUnit } from "./questions";
import type {
  Attempt,
  Level,
  StudyState,
  SubjectGap,
  SubjectId,
  WeakUnit,
} from "./types";

/**
 * 취약점 진단 엔진.
 *
 * "점수 78점" 하나만으로는 어느 단원이 약한지 알 수 없다.
 * 그래서 세 가지 신호를 합쳐 우선순위를 만든다.
 *
 *   ① 대입 비중       unit.weight       (0 ~ 5)
 *   ② 본인이 체크한 약점                (+3)
 *   ③ 목표 점수까지의 거리              (0 ~ 3)
 *   ④ 실제 풀이 정답률                  (0 ~ 4)
 */

const FLAG_BONUS = 3;
const GAP_FACTOR = 3;
const ACCURACY_FACTOR = 4;
/** 아직 한 번도 풀지 않은 단원의 중립값 — 너무 높으면 미응시 단원만 추천된다. */
const UNKNOWN_ACCURACY_SCORE = 1.5;
/** 정답률을 신뢰하려면 최소 이만큼은 풀어야 한다. */
const MIN_ATTEMPTS_FOR_ACCURACY = 3;

export function latestScore(
  state: StudyState,
  subjectId: SubjectId,
): number | null {
  const records = state.scores
    .filter((s) => s.subjectId === subjectId)
    .sort((a, b) => b.date.localeCompare(a.date));
  return records[0]?.score ?? null;
}

export function flaggedUnitIds(state: StudyState): Set<string> {
  const set = new Set<string>();
  for (const record of state.scores) {
    for (const id of record.wrongUnitIds) set.add(id);
  }
  return set;
}

export function unitAccuracy(
  attempts: Attempt[],
  unitId: string,
): { accuracy: number | null; total: number } {
  const rows = attempts.filter((a) => a.unitId === unitId);
  if (rows.length === 0) return { accuracy: null, total: 0 };
  const correct = rows.filter((a) => a.correct).length;
  return { accuracy: correct / rows.length, total: rows.length };
}

/** 정답률·점수를 근거로 시작 단계를 정한다. */
export function decideLevel(
  accuracy: number | null,
  subjectRatio: number | null,
  flagged: boolean,
): Level {
  if (accuracy !== null) {
    if (accuracy <= 0.5) return "basic";
    if (accuracy <= 0.75) return "advanced";
    return "applied";
  }
  if (flagged) return "basic";
  if (subjectRatio === null) return "basic";
  if (subjectRatio < 0.6) return "basic";
  if (subjectRatio < 0.8) return "advanced";
  return "applied";
}

export function computeWeakUnits(state: StudyState): WeakUnit[] {
  const flagged = flaggedUnitIds(state);
  const counts = questionCountByUnit();
  const out: WeakUnit[] = [];

  for (const subject of SUBJECTS) {
    const score = latestScore(state, subject.id);
    const target = state.profile?.targets[subject.id] ?? null;
    const ratio = score === null ? null : score / subject.maxScore;

    for (const unit of subject.units) {
      const { accuracy, total } = unitAccuracy(state.attempts, unit.id);
      const trusted = total >= MIN_ATTEMPTS_FOR_ACCURACY ? accuracy : null;
      const isFlagged = flagged.has(unit.id);
      const reasons: string[] = [];

      let priority = unit.weight;
      reasons.push(`대입 비중 ${unit.weight}/5`);

      if (isFlagged) {
        priority += FLAG_BONUS;
        reasons.push("진단에서 직접 체크한 단원");
      }

      if (score !== null && target !== null && target > score) {
        const gap = Math.min(1, (target - score) / subject.maxScore);
        priority += gap * GAP_FACTOR;
        reasons.push(`목표까지 ${Math.round(target - score)}점 부족`);
      }

      if (trusted !== null) {
        priority += (1 - trusted) * ACCURACY_FACTOR;
        reasons.push(`풀이 정답률 ${Math.round(trusted * 100)}%`);
      } else {
        priority += UNKNOWN_ACCURACY_SCORE;
        if (total > 0) reasons.push(`${total}문항 풀이 (판정에는 ${MIN_ATTEMPTS_FOR_ACCURACY}문항 이상 필요)`);
        else reasons.push("아직 풀어 본 기록 없음");
      }

      // 문항이 없는 단원은 추천해도 학습할 수 없으므로 뒤로 보낸다.
      if ((counts[unit.id] ?? 0) === 0) priority -= 100;

      const stored = state.mastery[unit.id];
      out.push({
        unitId: unit.id,
        subjectId: subject.id,
        unitName: unit.name,
        subjectName: subject.name,
        priority: Math.round(priority * 100) / 100,
        level: stored?.level ?? decideLevel(trusted, ratio, isFlagged),
        accuracy: trusted,
        reasons,
      });
    }
  }

  return out.sort((a, b) => b.priority - a.priority);
}

export function topWeakUnits(state: StudyState, n = 3): WeakUnit[] {
  return computeWeakUnits(state)
    .filter((w) => w.priority > 0)
    .slice(0, n);
}

export function subjectGaps(state: StudyState): SubjectGap[] {
  return SUBJECTS.map((subject) => {
    const current = latestScore(state, subject.id);
    const target = state.profile?.targets[subject.id] ?? subject.maxScore;
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      current,
      target,
      gap: current === null ? 0 : Math.max(0, target - current),
    };
  });
}

/** 진단 결과를 한 줄로 요약한다. */
export function diagnosisSummary(state: StudyState): string {
  const top = topWeakUnits(state, 3);
  if (top.length === 0) return "아직 진단 데이터가 없습니다.";
  const names = top.map((t) => `${subjectName(t.subjectId)}·${unitName(t.unitId)}`);
  return `이번 주 우선 보완: ${names.join(" / ")}`;
}

export function subjectMaxScore(subjectId: SubjectId): number {
  return getSubject(subjectId).maxScore;
}
