/**
 * Progress Notes Summary Component
 */

import React from "react";
import { View } from "@react-pdf/renderer";
import { renderSimpleText } from "../../ListViewRenderer";

/**
 * Progress Notes Summary Component
 * @param {Object} props - Component props
 * @param {Object} props.data - Summary data
 * @param {string} props.fontFamily - Font family
 * @returns {JSX.Element} Progress notes summary section
 */
const ProgressNotesSummary = ({ data, fontFamily = "Arial" }) => {
  if (!data?.progressNotesSummary) return null;

  const { summary, keyFindings, recommendations } = data.progressNotesSummary;

  return (
    <View style={{ padding: "6px 0px" }}>
      {summary && renderSimpleText(summary, fontFamily)}
      {keyFindings && renderSimpleText(`Key Findings: ${keyFindings}`, fontFamily)}
      {recommendations && renderSimpleText(`Recommendations: ${recommendations}`, fontFamily)}
    </View>
  );
};

export default ProgressNotesSummary;
