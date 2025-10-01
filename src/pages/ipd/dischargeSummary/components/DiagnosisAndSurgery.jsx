import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import FinalDiagnosis from "./FinalDiagnosis";
import ProvisionalDiagnosis from "./ProvisionalDiagnosis";
import SurgeriesPerformed from "./SurgeriesPerformed";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DiagnosisAndSurgery = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryDetails, surgeryProcedureOptions } = useSelector(
    (state) => state.dischargeSummary
  );
  const initialValue = useMemo(() => surgeryDetails || {}, [surgeryDetails]);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const renderSection = () => {
    return (
      <div className="diagnosis-and-surgery-container">
        {sectionData?.children?.map((item) => {
          return (
            <React.Fragment key={item.id}>
              {(() => {
                switch (item?.id) {
                  case "finalDiagnosis":
                    return renderFinalDiagnosis(item);
                  case "provisionalDiagnosis":
                    return renderProvisionalDiagnosis(item);
                  case "surgeriesPerformed":
                    return renderSurgeriesPerformed(item);
                  default:
                    return null;
                }
              })()}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderFinalDiagnosis = (data) => {
    return <FinalDiagnosis {...props} sectionData={data} />;
  };

  const renderProvisionalDiagnosis = (data) => {
    return <ProvisionalDiagnosis {...props} sectionData={data} />;
  };

  const renderSurgeriesPerformed = (data) => {
    return <SurgeriesPerformed {...props} sectionData={data} />;
  };

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={
          sectionData?.id
            ? dischargeSummaryIcons[`${sectionData.id}Dark`]
            : null
        }
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable ? "" : "collapsible-wrapper-class-readonly"
        }`}
        defaultOpen
      >
        {renderSection()}
      </CollapsibleWrapper>
    </>
  );
};

export default DiagnosisAndSurgery;
