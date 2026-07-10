/**
 * RadarChart — multi-variable comparison across 3+ axes. Zero-dependency
 * (pure SVG + own polar geometry). One polygon per series over a shared set of
 * axes; grid rings, axis labels, hover tooltip per axis, legend toggle.
 *
 * Data:   data (one row per axis) + axisKey; series (string | {key,label?,color?})[]
 * Scale:  max (auto), levels (grid rings)
 * Shape:  fillOpacity, strokeWidth, dot
 * Chrome: showGrid, showAxisLabels, showLegend, showTooltip, legendAlign
 * Misc:   height (square), colors[], valueFormat
 */
export const RadarChart: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
