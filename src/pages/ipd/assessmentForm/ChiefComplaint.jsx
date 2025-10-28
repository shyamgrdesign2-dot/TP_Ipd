import React, { useEffect, useMemo, useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/assessmentIcons/index";
import { useDispatch, useSelector } from "react-redux";
import { setChiefComplaint } from "../../../redux/ipd/assessmentsFormSlice";
import {
  convertTemplateDataToRichText,
  formatDateToShortMonthYear,
  isEmptyRichText,
} from "../../../utils/utils";
import { fetchSingleTemplate } from "../../../redux/ipd/ipdSlice";
import { addTemplate } from "../../../redux/symptomsSlice";
import { useDischargeSummaryData } from "../dischargeSummary/utils/useDischargeSummaryData";
// import { errorMessage } from "../../../utils/toast";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ChiefComplaint = (props) => {
  const {
    isEditable = true,
    sectionData,
    hideBorder = false,
    children,
    isDischargeSummary = false,
  } = props || {};
  const dispatch = useDispatch();
  const { showLastUpdatedAt } = useDischargeSummaryData();
  const {
    chiefComplaint,
    lastPrescriptionDataForAssessment,
    lastPrescriptionDate,
  } = useSelector((state) => state.assessment);
  const { templates: symptomsTemplates } = useSelector(
    (state) => state.symptoms
  );

  const { chiefComplaint: chiefComplaintFromLastPrescription = [] } =
    lastPrescriptionDataForAssessment;
  const { lastRxDate } = lastPrescriptionDate || {};
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
      !Array.isArray(chiefComplaintFromLastPrescription) ||
      !chiefComplaintFromLastPrescription?.[0]?.children
    ) {
      const convertedData = convertTemplateDataToRichText(
        chiefComplaintFromLastPrescription,
        "symptoms"
      );
      setAutoFillTextToAppend(convertedData);
    } else {
      setAutoFillTextToAppend(chiefComplaintFromLastPrescription);
    }
  };

  const isLastChiefComplaintPresent = useMemo(() => {
    return (
      (!Array.isArray(chiefComplaintFromLastPrescription) &&
        typeof chiefComplaintFromLastPrescription === "string" &&
        !!chiefComplaintFromLastPrescription) ||
      (Array.isArray(chiefComplaintFromLastPrescription) &&
        !!chiefComplaintFromLastPrescription?.[0]?.children?.[0]?.text) ||
      (Array.isArray(chiefComplaintFromLastPrescription) &&
        !!chiefComplaintFromLastPrescription?.[0]?.title)
    );
  }, [chiefComplaint, chiefComplaintFromLastPrescription]);

  if (!isEditable && isEmptyRichText(chiefComplaint)) return null;
  return (
    <div className="flex-column-gap-16">
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
          !isEmptyRichText(chiefComplaint)
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
        showAutoFill={isEditable && isLastChiefComplaintPresent}
        containerClass={`${hideBorder ? "ipdchiefcomplaint-hide-border" : ""} ${
          !isEditable ? "ipd-wrapper-class-readonly" : ""
        }`}
        opdDate={formatDateToShortMonthYear(lastRxDate)}
        onSave={() => {
          console.log("save");
        }}
        addTemplate={(templateData, callback) => {
          dispatch(addTemplate(templateData)).then((res) => {
            callback();
          });
        }}
        onErase={(e) => {
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
        renderFooter={() => {
          return children && children;
        }}
        headerComponent={!isEmptyRichText(chiefComplaint) ? showLastUpdatedAt : null}
      />
    </div>
  );
};

export default ChiefComplaint;
