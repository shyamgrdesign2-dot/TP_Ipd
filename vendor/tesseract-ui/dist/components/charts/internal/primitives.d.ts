export function GridLines({ x, y, w, h, yTicks, xTicks, showX, dashed }: {
    x: any;
    y: any;
    w: any;
    h: any;
    yTicks?: never[] | undefined;
    xTicks?: never[] | undefined;
    showX?: boolean | undefined;
    dashed?: boolean | undefined;
}): import("react/jsx-runtime").JSX.Element;
export function AxisLeft({ x, ticks, format }: {
    x: any;
    ticks: any;
    format: any;
}): import("react/jsx-runtime").JSX.Element;
export function AxisBottom({ y, ticks, format }: {
    y: any;
    ticks: any;
    format: any;
}): import("react/jsx-runtime").JSX.Element;
export function ChartLegend({ items, onToggle, align }: {
    items: any;
    onToggle: any;
    align?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
export function ChartToolbar({ onZoomIn, onZoomOut, onReset, onExport, zoomable }: {
    onZoomIn: any;
    onZoomOut: any;
    onReset: any;
    onExport: any;
    zoomable: any;
}): import("react/jsx-runtime").JSX.Element;
export function TooltipCard({ x, y, title, rows, containerWidth }: {
    x: any;
    y: any;
    title: any;
    rows: any;
    containerWidth: any;
}): import("react/jsx-runtime").JSX.Element;
