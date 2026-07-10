export function parseQualifiedName(raw: any): {
    name: any;
    family: any;
};
export function iconPath({ name, style, corner, family }?: {
    style?: string | undefined;
    corner?: string | undefined;
}): string | null;
export const ICON_STYLES: string[];
export const ICON_CORNERS: string[];
export const ICON_ALIAS: {
    "arrow-down-02": string;
    "arrow-right-02": string;
    "calendar-1": string;
    "chevron-down": string;
    "chevron-up": string;
    "chevron-left": string;
    "chevron-right": string;
    "more-horizontal": string;
    message: string;
    success: string;
};
export function resolveIconName(name: any): any;
export function normStyle(style: any): any;
export function normCorner(corner: any): any;
export function iconFamily(name: any): any;
export function hasIcon(name: any): boolean;
