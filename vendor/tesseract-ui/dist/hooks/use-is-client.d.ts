/**
 * useIsClient — false during SSR, true once mounted on the client. Built on
 * useSyncExternalStore so client-only UI (portals/overlays) can gate render
 * without a setState-in-effect mount flag.
 */
export function useIsClient(): boolean;
