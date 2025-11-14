/**
 * Discharge Summary Renderer
 */

import React from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import { getAllVisibleSections } from "../../utils/pdfUtils";
import FilledByCard from "../../components/FilledByCard";
import ReferralInformation from "./components/ReferralInformation";
import SectionTitle from "../SectionTitle";
import RichTextPrintRendererSection from "./components/RichTextPrintRendererSection";
import { isValidMongoId } from "../../../../utils/utils";
import CustomModuleRenderer from "../../components/CustomModuleRenderer";

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 12,
  },
});

const renderReferralInformation = (data, formatSettings, status) => {
  return (
    <ReferralInformation
      title="Referral Information"
      data={data}
      formatSettings={formatSettings}
      status={status}
    />
  );
};

const renderConsultantNotes = (data, formatSettings) => {
  return (
    <View style={styles.sectionContainer}>
      {data.map((consultantNote, consultantNoteIndex) => {
        if (Object.keys(consultantNote)?.length === 0) return null;
        return (
          <View>
            <SectionTitle
              title={`Consultant Notes ${
                data.length > 1 ? consultantNoteIndex + 1 : ""
              }`}
            />
            <RichTextPrintRendererSection
              data={{ consultantNotes: consultantNote || [] }}
              formatSettings={formatSettings || null}
              id="consultantNotes"
            />
          </View>
        );
      })}
    </View>
  );
};

export const renderCrossReferral = (data, formatSettings) => {
  const sortedSections = getAllVisibleSections(formatSettings || null);
  if (!data || !formatSettings) return [];

  const allSections = data.map((note, noteIndex) => {
    const crossReferralData = note?.crossReferral || {};
    const status = note?.status;
    const sectionRenderers = {
      referralInformation: () =>
        renderReferralInformation(
          crossReferralData?.referralInformation,
          formatSettings,
          status
        ),
      consultantNotes: () =>
        renderConsultantNotes(
          crossReferralData?.consultantNotes,
          formatSettings
        ),
    };

    // Render sections in order
    const sections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.id];
        if (section.isCustom || isValidMongoId(section.id)) {
          return (
            <CustomModuleRenderer
              section={section}
              data={note?.crossReferral?.customModules}
            />
          );
        }
        if (renderer) {
          return renderer();
        }
        return <Text>{""}</Text>;
      })
      .filter(Boolean);

    return (
      <View key={note._id || noteIndex}>
        <FilledByCard filledBy={note.createdByName} filledOn={note.createdAt} />
        {/* Content */}
        {sections}
      </View>
    );
  });
  return allSections;
};
