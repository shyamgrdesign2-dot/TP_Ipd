import * as React from "react";

/**
 * Doctor Agent workspace-context store (ported from HIMS). Holds the active IPD
 * sub-view so the panel can vary cards/pills by where the doctor is. The IPD hub
 * broadcasts into it; the agent subscribes via useWorkspaceContext().
 *
 * Shape: { module: "ipd" | null, section: string | null }
 */

const DEFAULT_CONTEXT = { module: "ipd", section: null };

let current = DEFAULT_CONTEXT;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

export function getWorkspaceContext() {
  return current;
}

/** Merge-patch the context. Broadcasts only when something actually changed. */
export function setWorkspaceContext(patch) {
  if (!patch) return;
  const next = { ...current, ...patch };
  if (next.module === current.module && next.section === current.section) return;
  current = next;
  emit();
}

export function clearWorkspaceContext() {
  setWorkspaceContext({ ...DEFAULT_CONTEXT });
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: returns { module, section } and re-renders on change. */
export function useWorkspaceContext() {
  return React.useSyncExternalStore(subscribe, getWorkspaceContext, getWorkspaceContext);
}
