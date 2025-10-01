import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../../shared/remoteComponents";
import { defaultIcons as dischargeSummaryIcons } from "../../../../assets/images/indices";
import { defaultIcons } from "../../../../assets/images/icons";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const DischargeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  const { surgeryDetails, surgeryProcedureOptions } = useSelector(
    (state) => state.dischargeSummary
  );
  const initialValue = useMemo(() => surgeryDetails || {}, [surgeryDetails]);
  const dispatch = useDispatch();
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);

  const renderSection = () => {
    return (
        <div>Discharge Notes</div>
    )
  }

  return (
    <>
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? dischargeSummaryIcons[`${sectionData.id}Dark`] : null}
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

export default DischargeNotes;
