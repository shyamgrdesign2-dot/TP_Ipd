import { useSyncExternalStore } from "react";

/**
 * Progress-notes print-view store — the "View all progress notes" hand-off. The
 * Source affordance on a progress-notes card opens every note of that kind
 * (nursing | mo) as a scrollable print sheet in a right sidebar. External store
 * (mirrors printViewStore) so any card can open it without prop drilling.
 */

let state = { open: false, kind: "nursing" };
const listeners = new Set();

function emit() {
  state = { ...state };
  listeners.forEach((l) => {
    try { l(); } catch { /* ignore */ }
  });
}

export function openProgressPrint(kind) {
  state = { open: true, kind: kind === "mo" ? "mo" : "nursing" };
  emit();
}

export function closeProgressPrint() {
  if (!state.open) return;
  state = { open: false, kind: state.kind };
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProgressPrint() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
