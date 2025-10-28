/**
 * Discharge Summary Renderer
 */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { getAllVisibleSections } from "../../utils/pdfUtils";
import FilledByCard from "../../components/FilledByCard";
import ReferralInformation from "./components/ReferralInformation";
import SectionTitle from "../SectionTitle";
import RichTextPrintRendererSection from "./components/RichTextPrintRendererSection";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
  },
});

const renderReferralInformation = (data, fontFamily, formatSettings) => {
  return (
    <ReferralInformation
      title="Referral Information"
      data={data}
      fontFamily={fontFamily}
      formatSettings={formatSettings}
    />
  );
};

const renderConsultantNotes = (data, fontFamily, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionTitle title="Consultant Notes" fontFamily={fontFamily} />
      <RichTextPrintRendererSection
        data={data}
        fontFamily={fontFamily}
        formatSettings={formatSettings || null}
        id="consultantNotes"
      />
    </View>
  );
};

export const renderCrossReferral = (data, formatSettings, fontFamily) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);
  if (!data || !formatSettings) return [];

  const allSections = data.map((note, noteIndex) => {
    const crossReferralData = note?.crossReferral || {};
    const sectionRenderers = {
      referralInformation: () =>
        renderReferralInformation(
          crossReferralData?.referralInformation,
          fontFamily,
          formatSettings
        ),
      consultantNotes: () =>
        renderConsultantNotes(
          crossReferralData?.consultantNotesData,
          fontFamily,
          formatSettings
        ),
    };

    // Render sections in order
    const sections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.id];
        if (renderer) {
          return renderer();
        }
        return null;
      })
      .filter(Boolean);

    return (
      <View key={note._id || noteIndex}>
        <FilledByCard
          filledBy={note.createdByName}
          filledOn={note.createdAt}
          fontFamily={fontFamily}
        />
        {/* Content */}
        {sections}
      </View>
    );
  });
  return allSections;
};
