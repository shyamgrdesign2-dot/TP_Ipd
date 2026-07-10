export function scaleLinear(domain: any, range: any): {
    (v: any): any;
    invert(px: any): any;
    domain: any[];
    range: any[];
};
export function scaleBand(domainArr: any, range: any, padding?: number): {
    (v: any): any;
    bandwidth: number;
    step: number;
    domain: any;
    range: any[];
};
export function niceTicks(min: any, max: any, count?: number): {
    ticks: number[];
    niceMin: number;
    niceMax: number;
    step: number;
};
export function smoothPath(pts: any): string;
export function stepPath(pts: any): string;
export function pathFor(pts: any, curve?: string): string;
export function areaPath(pts: any, y0: any, curve?: string): string;
export function barPath(x: any, y: any, w: any, h: any, r: any, horizontal: any): string;
export function arcPath(cx: any, cy: any, rOuter: any, rInner: any, startAngle: any, endAngle: any): string;
export function formatCompact(n: any): string;
export function formatIndian(n: any): string;
export function downloadCSV(filename: any, rows: any): void;
export function extent(arr: any, acc?: (d: any) => any): number[];
export function sum(arr: any, acc?: (d: any) => any): any;
export function maxOf(arr: any, acc?: (d: any) => any): any;
export function linePath(pts: any): string;
export function polar(cx: any, cy: any, r: any, angle: any): {
    x: any;
    y: any;
};
export function formatNumber(n: any): any;
export const SERIES_COLORS: string[];
export function seriesColor(i: any, custom: any): any;
export namespace MARGINS {
    let top: number;
    let right: number;
    let bottom: number;
    let left: number;
}
