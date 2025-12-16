import Vitals from "../../components/Vitals";
import MedicationTable from "../../components/MedicationTable";
import LabInvestigationTable from "../../components/LabInvestigationTable";
import { getAllVisibleSections, renderRichText } from "../../utils/pdfUtils";
import { View } from "@react-pdf/renderer";
import FilledByCard from "../../components/FilledByCard";
import { renderGeneralExamination } from "../discharge/components/PhysicalExamination";
import { isValidMongoId } from "../../../../utils/utils";
import CustomModuleRenderer from "../../components/CustomModuleRenderer";
import { Text } from "../../components/MultilingualText";

export const renderConsultantNotes = (
  data,
  formatSettings,
  frequencyList,
  timingList,
  fontSize
) => {
  if (!data || !formatSettings) return [];

  // Check if data is an array (multiple consultant notes) or single object
  const consultantNotesArray = Array.isArray(data) ? data : [data];

  // Get sorted sections
  const sortedSections = getAllVisibleSections(formatSettings);

  // Render all consultant notes on the same page
  const allSections = consultantNotesArray.map((note, noteIndex) => {
    const consultationData = note?.consultationNotes || note;

    // Map section keys to render functions (using new array format IDs)
    const sectionRenderers = {
      clinicalAssessmentPlan: () =>
        renderRichText(
          consultationData.clinicalAssessmentPlan,
          "Clinical Assessment & Plan"
        ),
      vitals: () => <Vitals vitals={consultationData.vitals} title="Vitals" />,
      examinations: () =>
        renderGeneralExamination(consultationData.examination, {
          label: "Examination",
        }),
      // fluidBalance: () => <Vitals vitals={consultationData.vitals} title="Vitals" />,
      medication: () => (
        <MedicationTable
          medications={
            consultationData.medication || consultationData.currentMedication
          }
          title="Medication (Rx)"
          frequencyList={frequencyList}
          timingList={timingList}
          fontSize={fontSize}
        />
      ),
      labInvestigation: () => (
        <LabInvestigationTable
          investigations={consultationData.labInvestigation}
          title="Lab Investigation"
        />
      ),
      additionalRemarks: () =>
        renderRichText(
          consultationData.additionalRemarks,
          "Additional Remarks"
        ),
    };

    // Render sections in order for this note
    const noteSections = sortedSections
      .map((section) => {
        const renderer = sectionRenderers[section.key];

        if (section.isCustom || isValidMongoId(section.id)) {
          return (
            <CustomModuleRenderer
              section={section}
              data={consultationData?.customModules}
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
        {noteSections}
      </View>
    );
  });

  return allSections;
};
