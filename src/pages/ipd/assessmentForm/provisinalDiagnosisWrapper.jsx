import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultIcons as assessmentsIcons } from "../../../assets/images/assessmentIcons/index";
import { setPhysicalExaminationProvisionalDiagnosisData } from "../../../redux/ipd/assessmentsFormSlice";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import ProvisionalDiagnosis from "../dischargeSummary/components/ProvisionalDiagnosis";

const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");

const ProvisionalDiagnosisWrapper = (props) => {
  const { sectionData, isEditable = true } = props || {};
  const dispatch = useDispatch();
  const { physicalExaminationProvisionalDiagnosisData = [] } = useSelector(
    (state) => state.assessment
  );
  const [autoFillTextToAppendProvisionalDiagnosis, setAutoFillTextToAppendProvisionalDiagnosis] = React.useState([]);

  const handleProvisionalDiagnosisChange = (value) => {
    // Handle provisional diagnosis changes here
    console.log("Provisional diagnosis changed:", value);
    dispatch(setPhysicalExaminationProvisionalDiagnosisData(value));
  };

  return (
    <CollapsibleWrapper
          title={sectionData?.title}
          data-testid={sectionData?.id}
          icon={assessmentsIcons.provisionalDiagnosisPcDark}
          collapsible={isEditable}
          width={"100%"}
          className={`collapsible-wrapper-class ${
            isEditable ? "" : "collapsible-wrapper-class-readonly"
          }`}
          defaultOpen
        >
            <ProvisionalDiagnosis {...props} sectionData={sectionData?.children[0]} />
        </CollapsibleWrapper>
  );
};

export default ProvisionalDiagnosisWrapper;
