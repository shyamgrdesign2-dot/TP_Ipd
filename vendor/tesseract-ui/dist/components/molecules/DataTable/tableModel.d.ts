export function columnPxWidth(col: any): number;
export function orderColumns(columns: any): any[];
/**
 * Cumulative sticky offsets keyed by column id:
 *   { [id]: { side: "left"|"right", offset: px, edge: boolean } }
 * `edge` marks the column on the INNER boundary of its band (the one that casts
 * the divider shadow towards the scrolling area). `leadingWidth` is the width of
 * the pinned control column that sits left of every left-sticky data column.
 */
export function stickyOffsets(orderedColumns: any, { leadingWidth }?: {
    leadingWidth?: number | undefined;
}): {};
export function collectKeys(data: any, { rowKey, getSubRows }: {
    rowKey: any;
    getSubRows: any;
}): any[];
export function branchKeys(rows: any, { rowKey, getSubRows }: {
    rowKey: any;
    getSubRows: any;
}): any[];
/**
 * Flatten `data` into the ordered list of VISUAL rows the body renders:
 *   { kind: "group", group, label, count, keys, collapsed, gi }
 *   { kind: "data",  row, key, depth, hasChildren, expanded, index }
 * Honours grouping (top level), nesting (recursive) and the collapse/expand sets.
 */
export function flattenRows(data: any, opts: any): {
    kind: string;
    group: any;
    label: any;
    count: any;
    keys: any[];
    collapsed: any;
    gi: number;
}[];
/**
 * For every `column.spanRows` column, merge vertically-adjacent DATA rows that
 * share the same value into a single rowSpan'd cell. Returns:
 *   { spanMap: { "<visualIdx>:<colId>": rowSpan }, skip: Set("<visualIdx>:<colId>") }
 * Runs never cross group headers or expanded nesting (depth changes break a run),
 * so merged cells stay within a coherent block.
 */
export function computeRowSpans(visualRows: any, columns: any): {
    spanMap: {};
    skip: Set<any>;
};
/**
 * DataTable model — pure, framework-agnostic helpers that turn the flat
 * `data`/`columns` config into the structures the renderer needs:
 *
 *   orderColumns       sticky-left → normal → sticky-right (preserving order)
 *   columnPxWidth      the px width used for sticky offset math
 *   stickyOffsets      cumulative left/right px offset per sticky column
 *   collectKeys        every row key incl. nested descendants (for select-all)
 *   flattenRows        data → visual rows (group headers + data rows w/ depth),
 *                      honouring grouping, nesting and collapse/expand state
 *   computeRowSpans    per-cell rowSpan + a skip-set for `column.spanRows`
 *
 * Keeping this out of the component keeps the render path readable and the math
 * unit-testable. No React, no DOM.
 */
export const DEFAULT_MIN_WIDTH: 88;
export const LEADING_COL_WIDTH: 48;
