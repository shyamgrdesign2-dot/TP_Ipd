import React, { useState, useRef } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";
import { isEmptyRichText } from "../../../../utils/utils";
import DiagnosisPickerTable from "../../components/DiagnosisPickerTable/DiagnosisPickerTable";
import { defaultIcons } from "../../../../assets/images/icons";
import DrawerWrapper from "../../components/DrawerWrapper/DrawerWrapper";
import { setProvisionalDiagnosis } from "../../../../redux/ipd/dischargeSummarySlice";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const GenericCard = createRemoteComponent("GenericCard");

const ProvisionalDiagnosis = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const [addProvisionalDiagnosisDrawer, setAddProvisionalDiagnosisDrawer] =
    useState(false);
  const dispatch = useDispatch();
  const { provisionalDiagnosis } = useSelector(
    (state) => state.dischargeSummary
  );
  const diagnosisPickerTableRef = useRef(null);
  const handleAddProvisionalDiagnosis = () => {
    setAddProvisionalDiagnosisDrawer(!addProvisionalDiagnosisDrawer);
  };

  const onSaveClick = () => {
    if (diagnosisPickerTableRef.current?.saveRows) {
      const rows = diagnosisPickerTableRef.current.saveRows();
      console.log("INTEL ==> ROWS", rows);
      dispatch(setProvisionalDiagnosis(rows));
      setAddProvisionalDiagnosisDrawer(false);
    }
  };

  if (!isEditable && isEmptyRichText(provisionalDiagnosis)) return null;

  const renderProvisionalDiagnosis = () => {
    return (
      <div className="ipd-provisional-diagnosis-container">
        <DiagnosisPickerTable itemId={'provisionalDiagnosis'} isEditable={false} ref={diagnosisPickerTableRef} />
        {isEditable ? (
          <div onClick={handleAddProvisionalDiagnosis}>
            <GenericCard
              icon={
                provisionalDiagnosis?.length
                  ? defaultIcons.editIcon
                  : defaultIcons.plusIconColoured
              }
              title={
                provisionalDiagnosis?.length
                  ? "Add/Edit Provisional Diagnosis"
                  : "Add Provisional Diagnosis"
              }
            ></GenericCard>
          </div>
        ) : null}
        {addProvisionalDiagnosisDrawer && (
          <DrawerWrapper
            width={"100%"}
            open={addProvisionalDiagnosisDrawer}
            onClose={handleAddProvisionalDiagnosis}
            title="Provisional Diagnosis"
            saveButtonText="Save"
            onSave={onSaveClick}
          >
            <RichTextEditWrapper
              readOnly={true}
              showToolbar={true}
              showActionBtns={true}
              showOnlyClear={isEditable}
              title={sectionData?.title}
              data-testid={sectionData?.id}
              width="100%"
              containerClass={`wrapper-class ipd-provisional-diagnosis-wrapper ${
                !isEditable ? "ipd-wrapper-class-readonly" : ""
              }`}
              showAutoFill={false}
              renderBody={() => {
                return (
                    <DiagnosisPickerTable itemId={'provisionalDiagnosis'} isEditable={true} ref={diagnosisPickerTableRef} />
                )
              }}
            />
          </DrawerWrapper>
        )}
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
