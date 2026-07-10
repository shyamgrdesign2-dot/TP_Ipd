import { useSyncExternalStore } from "react";

/**
 * Print-view store — the "View full note" hand-off. The Source affordance on an
 * agent card opens the doctor's consultation-note print view in a right sidebar.
 * External store (mirrors patientStore) so any card can open it without prop
 * drilling. `meta` optionally scopes the view (e.g. { focus: "medications" }).
 */

let state = { open: false, meta: null };
const listeners = new Set();

function emit() {
  state = { ...state };
  listeners.forEach((l) => {
    try { l(); } catch { /* ignore */ }
  });
}

export function openPrintView(meta) {
  state = { open: true, meta: meta || null };
  emit();
}

export function closePrintView() {
  if (!state.open) return;
  state = { open: false, meta: null };
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePrintView() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
