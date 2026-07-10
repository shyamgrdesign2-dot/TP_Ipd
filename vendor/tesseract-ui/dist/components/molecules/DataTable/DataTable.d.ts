/**
 * DataCell — primary line (+ optional subtext), each with optional left/right
 * icons. With subtext the primary truncates at 1 line; without subtext at 2.
 */
export function DataCell({ primary, secondary, primaryLeftIcon, primaryRightIcon, secondaryLeftIcon, secondaryRightIcon, maxLines, align, tooltipSide, className, }: {
    primary: any;
    secondary: any;
    primaryLeftIcon: any;
    primaryRightIcon: any;
    secondaryLeftIcon: any;
    secondaryRightIcon: any;
    maxLines: any;
    align?: string | undefined;
    tooltipSide?: string | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace DataCell {
    let displayName: string;
}
/** CellTag — status pill for `type: "tag"` columns. tone: neutral|primary|success|warning|error
 *
 *  Two flavours:
 *   • non-actionable (default) → Badge atom (soft) — a static label.
 *   • actionable (`actionable`/`onClick`) → Chip atom — gains a hover + click
 *     (press) effect and is keyboard/clickable. Use for filter-style tags.
 *  Optional leading `icon`. */
export function CellTag({ label, tone, actionable, onClick, icon, variant }: {
    label: any;
    tone?: string | undefined;
    actionable?: boolean | undefined;
    onClick: any;
    icon: any;
    variant?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
export namespace CellTag {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export function TableActions({ primary, actions, align }: {
    primary: any;
    actions?: never[] | undefined;
    align?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
export namespace TableActions {
    let displayName_2: string;
    export { displayName_2 as displayName };
}
export const DataTable: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export default DataTable;
import * as React from "react";
