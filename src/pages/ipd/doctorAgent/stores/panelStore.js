import * as React from "react";

/**
 * Doctor Agent panel open/close store (ported from HIMS). A tiny external store so
 * the panel can be opened both by its own FAB and programmatically from anywhere.
 */

let open = false;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

export function isPanelOpen() {
  return open;
}

export function openPanel() {
  if (open) return;
  open = true;
  emit();
}

export function closePanel() {
  if (!open) return;
  open = false;
  emit();
}

export function togglePanel() {
  open = !open;
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: returns the boolean open state and re-renders on change. */
export function useAgentOpen() {
  return React.useSyncExternalStore(subscribe, isPanelOpen, isPanelOpen);
}
