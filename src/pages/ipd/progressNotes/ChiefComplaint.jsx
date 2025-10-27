import React, {useMemo, useState, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setChiefComplaint } from "../../../redux/ipd/progressNotesSlice";
import {
  convertTemplateDataToRichText,
  formatDateToShortMonthYear,
} from "../../../utils/utils";
import { fetchSingleTemplate } from "../../../redux/ipd/ipdSlice";
// import { errorMessage } from "../../../utils/toast";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ChiefComplaint = (props) => {
  // You can pass props as needed, e.g., isEditable, initialValue, etc.
  const { isEditable = true,shouldAutofill = false, sectionData } = props || {};
  const dispatch = useDispatch();
  const {
    chiefComplaint,
    lastPrescriptionDataForProgress,
    lastPrescriptionDate,
  } = useSelector((state) => state.progressNotes);
  const { templates: symptomsTemplates } = useSelector(
    (state) => state.symptoms
  );

  const { progressNotes } = useSelector((state) => state.progressNotes);
  const prevProgressNote = useMemo(() => {
    return progressNotes[progressNotes?.length - 1];
  }, [progressNotes]);
  const prevChiefComplaint = useMemo(() => {
    return prevProgressNote?.progressNotes?.chiefComplaint;
  }, [prevProgressNote]);

  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState([]);
  const [isShimmering, setIsShimmering] = useState(false);

  const handleTempleteSelection = async (template, type) => {
    setIsShimmering(true);
    const respData = await dispatch(
      fetchSingleTemplate({ templateId: template?.tst_id, type })
    );
    if (respData.meta.requestStatus === "fulfilled") {
      const updatedData = respData?.payload;
      const newConvertedData = convertTemplateDataToRichText(updatedData, type);
      setIsShimmering(false);
      setAutoFillTextToAppend(newConvertedData);
    } else {
      setIsShimmering(false);
    }
  };

  const handleAutoFill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }
    if (
      !Array.isArray(prevChiefComplaint) ||
      !prevChiefComplaint?.[0]?.children
    ) {
      const convertedData = convertTemplateDataToRichText(
        prevChiefComplaint,
        "symptoms"
      );
      setAutoFillTextToAppend(convertedData);
    } else {
      setAutoFillTextToAppend(prevChiefComplaint);
    }
  };

  const handleAutofill = (e) => {
    if (e?.[0] === "undo") {
      setAutoFillTextToAppend(e);
      return;
    }

    setAutoFillTextToAppend(prevChiefComplaint);
  };

  useEffect(() => {
    if (shouldAutofill) {
      handleAutofill();
    }
  }, [shouldAutofill]);

  const hasChiefComplaintInLastProgressNote = useMemo(() => {

    return (
      (!Array.isArray(prevChiefComplaint) &&
        typeof prevChiefComplaint === "string" &&
        !!prevChiefComplaint) ||
      (Array.isArray(prevChiefComplaint) &&
        !!prevChiefComplaint?.[0]?.children?.[0]?.text)
    );
  }, [chiefComplaint, prevChiefComplaint]);

  if (!isEditable && !chiefComplaint?.length) return null;

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      templates={symptomsTemplates}
      templateType="symptoms"
      title={sectionData?.title}
      data-testid={sectionData?.id}
      width={isEditable ? "100%" : "fit-content"}
      initialValue={
        chiefComplaint?.length > 0
          ? chiefComplaint
          : [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
      }
      placeholder={
        "Enter chief complaint like patient’s main symptoms or presenting problem"
      }
      icon={defaultIcons[`${sectionData?.id}Pc`]}
      showAutoFill={isEditable && hasChiefComplaintInLastProgressNote}
      autoFillTitle={
        hasChiefComplaintInLastProgressNote
          ? `Autofill From Prev. Progress Notes (${new Date(
              prevProgressNote?.createdAt
            ).toLocaleDateString()}, ${new Date(
              prevProgressNote?.createdAt
            ).toLocaleTimeString()})`
          : "No previous profress notes available"
      }
      containerClass={`${!isEditable ? 'ipd-wrapper-class-readonly' : ''}`}
      opdDate={prevProgressNote?.createdAt ? formatDateToShortMonthYear(prevProgressNote?.createdAt || ""): null}
      onSave={() => {
        console.log("save");
      }}
      onErase={() => {
        setAutoFillTextToAppend(["clear"]);
      }}
      onTemplate={() => {
        console.log("template");
      }}
      onTemplateSelected={handleTempleteSelection}
      shimmerFromParent={true}
      onChange={(e) => dispatch(setChiefComplaint(e))}
      onAutoFill={handleAutoFill}
      newAutoFillTextToAppend={autoFillTextToAppend}
      setNewAutoFillTextToAppend={setAutoFillTextToAppend}
      isShimmeringFromParent={isShimmering}
    />
  );
};

export default ChiefComplaint;
