import React, { useState, useRef } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import { isEmptyRichText } from "../../../../utils/utils";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import { dischargeSummaryIcons } from "../../../../assets/images/indices";
import DrawerWrapper from "../../components/DrawerWrapper/DrawerWrapper";
import { setProvisionalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const ProvisionalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [addProvisionalDiagnosisDrawer, setAddProvisionalDiagnosisDrawer] =
    useState(false);
  const dispatch = useDispatch();
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
        <DiagnosisPickerTable itemId={'provisionalDiagnosis'} isEditable={false} ref={diagnosisPickerTableRef} />
      )
    }
    return (
      <div className="ipd-provisional-diagnosis-container">
        <DiagnosisPickerTable itemId={'provisionalDiagnosis'} isEditable={true} ref={diagnosisPickerTableRef} />
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
      isDataPresent={(provisionalDiagnosis)?.length}  
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
      renderBody={renderProvisionalDiagnosis}
    />
  );
};

export default ProvisionalDiagnosis;
