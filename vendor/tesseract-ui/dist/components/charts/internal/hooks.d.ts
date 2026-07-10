export function useElementWidth(initial?: number): (number | React.RefObject<null>)[];
export function useZoomPan(enabled: any): {
    win: {
        lo: number;
        hi: number;
    };
    active: any;
    handlers: {
        onWheel: (e: any) => void;
        onPointerDown: (e: any) => void;
        onPointerMove: (e: any) => void;
        onPointerUp: (e: any) => void;
        onPointerLeave: (e: any) => void;
    } | {
        onWheel?: undefined;
        onPointerDown?: undefined;
        onPointerMove?: undefined;
        onPointerUp?: undefined;
        onPointerLeave?: undefined;
    };
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
};
import * as React from "react";
