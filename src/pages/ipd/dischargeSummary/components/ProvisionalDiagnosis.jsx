import React, { useState, useRef } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import { dischargeSummaryIcons } from "../../../../assets/images/indices";
import { setProvisionalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";
import { useDischargeSummaryData } from "../utils/useDischargeSummaryData";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ProvisionalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { showLastUpdatedAt } = useDischargeSummaryData();
  const { dischargeSummaryData } = useSelector(
    (state) => state.dischargeSummary
  );
  const { provisionalDiagnosis = [] } =
    dischargeSummaryData?.diagnosisAndSurgery || {};
  const diagnosisPickerTableRef = useRef(null);

  if (!isEditable && provisionalDiagnosis.length === 0) return null;

  const renderProvisionalDiagnosis = () => {
    if (!isEditable) {
      return (
        <DiagnosisPickerTable
          itemId={"provisionalDiagnosis"}
          isEditable={false}
          ref={diagnosisPickerTableRef}
        />
      );
    }
    return (
      <div className="ipd-provisional-diagnosis-container">
        <DiagnosisPickerTable
          itemId={"provisionalDiagnosis"}
          isEditable={true}
          ref={diagnosisPickerTableRef}
        />
      </div>
    );
  };

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      showMicrophone={false}
      title={sectionData?.title}
      icon={dischargeSummaryIcons[`${sectionData?.id}Pc`]}
      showOnlyClear={isEditable}
      isDataPresent={provisionalDiagnosis?.length}
      onErase={(e) => {
        dispatch(setProvisionalDiagnosis([]));
      }}
      initialValue={
        provisionalDiagnosis || [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]
      }
      placeholder="Enter provisional diagnosis"
      headerComponent={!!provisionalDiagnosis.length && showLastUpdatedAt}
      renderBody={renderProvisionalDiagnosis}
    />
  );
};

export default ProvisionalDiagnosis;
