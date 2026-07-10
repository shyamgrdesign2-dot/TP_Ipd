/**
 * GaugeChart — a single value against a range (KPI vs target). Zero-dependency
 * (own arc geometry). A rounded arc with a neutral track, a value arc coloured
 * by optional thresholds, a big centre readout, and range labels.
 *
 * Value:   value, min (0), max (100), valueFormat, unit, label, showValue, showRange
 * Arc:     height, arcDegrees (sweep), thickness, rounded
 * Colour:  color, trackColor, segments ([{ upTo, color }] threshold colouring)
 */
export const GaugeChart: React.ForwardRefExoticComponent<React.RefAttributes<any>>;
import * as React from "react";
