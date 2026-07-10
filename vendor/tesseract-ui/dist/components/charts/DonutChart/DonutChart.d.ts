/**
 * DonutChart — part-to-whole composition. Zero-dependency (own arc geometry).
 * Deeply configurable; defaults preserve the standard donut look.
 *
 * Data:     data [{ label, value, color? }]
 * Ring:     height/size, innerRadius (0→pie), padAngle (deg gap), startAngle
 *           (deg), sort ("none"|"desc"|"asc"), sliceStroke, sliceStrokeColor,
 *           hoverExpand
 * Center:   showCenter, centerLabel, centerValueFormat
 * Legend:   legend ("right"|"bottom"|"none"), showPercent, showValue
 * Other:    showTooltip, colors[], valueFormat, emptyText
 */
export const DonutChart: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
/** PieChart — DonutChart with no hole (full pie). */
export const PieChart: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
