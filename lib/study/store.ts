"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { StudyState } from "./types";
import { emptyState, loadState, saveState } from "./storage";

/**
 * 아주 작은 전역 스토어.
 *
 * 서버 렌더링 결과와 첫 클라이언트 렌더링 결과가 반드시 같아야 하므로
 * (hydration mismatch 방지) localStorage는 마운트 이후에 읽는다.
 * 그때까지 hydrated=false 이고 화면은 스켈레톤을 보여 준다.
 */

let state: StudyState = emptyState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const fn of listeners) fn();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getState(): StudyState {
  return state;
}

export function isHydrated(): boolean {
  return hydrated;
}

export function hydrate(): void {
  if (hydrated) return;
  state = loadState();
  hydrated = true;
  emit();
}

export function setState(updater: (prev: StudyState) => StudyState): void {
  state = updater(state);
  saveState(state);
  emit();
}

export function resetState(): void {
  state = emptyState();
  saveState(state);
  emit();
}

function getServerSnapshot(): StudyState {
  return state;
}

export function useStudyState(): { state: StudyState; hydrated: boolean } {
  const snapshot = useSyncExternalStore(subscribe, getState, getServerSnapshot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, []);

  return { state: snapshot, hydrated: mounted && hydrated };
}

export function useStudyActions() {
  return useCallback(setState, []);
}
