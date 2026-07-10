export namespace SURFACE_GRADIENTS {
    let violet: string;
    let blue: string;
}
export namespace SURFACE_RAY_COLORS {
    let violet_1: string[];
    export { violet_1 as violet };
    let blue_1: string[];
    export { blue_1 as blue };
}
export const SURFACE_TONES: string[];
export const DEFAULT_SURFACE_TONE: "violet";
export const GRAIN_IMAGE: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
export namespace grainStyle {
    export let position: string;
    export let inset: number;
    export let zIndex: number;
    export let pointerEvents: string;
    export let opacity: number;
    export let mixBlendMode: string;
    export { GRAIN_IMAGE as backgroundImage };
    export let backgroundSize: string;
}
