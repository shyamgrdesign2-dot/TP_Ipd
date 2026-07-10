/**
 * useTouchDevice — true on touch-only devices (e.g. tablet/mobile), detected via
 * `(hover: none) and (pointer: coarse)`. Built on useSyncExternalStore so it
 * stays in sync without setState-in-effect.
 */
export function useTouchDevice(): boolean;
