import React, { useState } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons } from "../../../assets/images/icons";
import { useDispatch, useSelector } from "react-redux";
import { setChiefComplaint } from "../../../redux/ipd/assessmentsFormSlice";
import { convertTemplateDataToRichText } from "../../../utils/utils";
import { fetchSingleTemplate } from "../../../redux/ipd/ipdSlice";
// import { errorMessage } from "../../../utils/toast";
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const ChiefComplaint = (props) => {
  // You can pass props as needed, e.g., isEditable, initialValue, etc.
  const { isEditable = true, sectionData } = props || {};
  const dispatch = useDispatch();
  const { chiefComplaint, lastPrescriptionDataForAssessment } = useSelector(
    (state) => state.assessment
  );
  const { templates: symptomsTemplates } = useSelector(
    (state) => state.symptoms
  );
  const { chiefComplaint: chiefComplaintFromLastPrescription = [] } =
    lastPrescriptionDataForAssessment;
  
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
    if (!Array.isArray(chiefComplaintFromLastPrescription) || !chiefComplaintFromLastPrescription?.[0]?.children) {
      const convertedData = convertTemplateDataToRichText(
        chiefComplaintFromLastPrescription,
        "symptoms"
      );
      setAutoFillTextToAppend(convertedData);
    } else {
      setAutoFillTextToAppend(chiefComplaintFromLastPrescription);
    }
  }

  return (
    <RichTextEditWrapper
      readOnly={!isEditable}
      showToolbar={isEditable}
      showActionBtns={isEditable}
      templates={symptomsTemplates}
      templateType="symptoms"
      title={sectionData?.title}
      width="100%"
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
      icon={defaultIcons[sectionData?.icon]}
      showAutoFill={isEditable}
      containerClass="wrapper-class"
      opdDate="15 Jun 2025"
      onSave={() => {
        console.log("save");
      }}
      onErase={() => {
        console.log("erase");
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
