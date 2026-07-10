/** Read the analytics surface: { track, enabled }. */
export function useAnalytics(): {
    track: () => void;
    enabled: boolean;
};
/**
 * Normalise a component's `track` prop into an event-partial (or null).
 * Accepts a string id, a partial-event object, or nothing:
 *   track="rxpad.save"                     → { id: "rxpad.save" }
 *   track={{ id: "x", meta: { plan } }}    → as-is
 *   track={undefined}                      → null (don't emit)
 */
export function resolveTrack(track: any): any;
/**
 * Analytics context — the design-system-wide action-tracking surface.
 *
 * It is OPT-IN and zero-cost by default: with no <TPAnalyticsProvider> above
 * them, components read this default context whose `track` is a no-op, so nothing
 * is emitted and there is no overhead. Wrap a subtree in a provider and pass
 * `onTrack` to start receiving events.
 *
 * Event shape (what a provider's onTrack receives):
 *   { component, action, id?, label?, value?, meta?, timestamp, ...globalContext }
 *     component  the emitting component, e.g. "Button" | "DataTable"
 *     action     what happened, e.g. "click" | "sort" | "select" | "row_click"
 *     id         the developer-supplied tracking id (from a `track`/`analyticsId`)
 *     label      a human label (e.g. the button text, the column header)
 *     value      an optional scalar payload (e.g. the new page index)
 *     meta       free-form structured payload (merged with provider context.meta)
 *     timestamp  Date.now() at emit time
 */
export const AnalyticsContext: import("react").Context<{
    track: () => void;
    enabled: boolean;
}>;
