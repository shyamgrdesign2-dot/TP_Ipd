/**
 * LineChart — multi-series time/trend chart. Zero-dependency (pure SVG + own
 * scales/curves). Deeply configurable; defaults preserve the standard look.
 *
 * Data:        data, xKey, series (string | {key,label?,color?})[]
 * Size:        height, margin ({top,right,bottom,left} partial), width (fixed)
 * Line:        curve ("smooth"|"linear"|"step"), strokeWidth, area, areaOpacity,
 *              markers, markerSize
 * Value axis:  yMin, yMax, yTickCount, yFormat, showYAxis, yAxisLabel
 * Category axis: xFormat, showXAxis, xAxisLabel, xTickCount
 * Grid:        showGrid, gridStyle ("solid"|"dashed"), showVerticalGrid
 * Legend:      showLegend, legendPosition ("top"|"bottom"), legendAlign
 * Interaction: showTooltip, showCrosshair, zoomable, showToolbar
 * Misc:        colors[], emptyText
 */
export const LineChart: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
