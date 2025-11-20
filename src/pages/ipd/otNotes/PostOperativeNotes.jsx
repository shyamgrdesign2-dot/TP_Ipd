import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setPostOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import { Select } from "antd";
import { isEmptyRichText, hasNoData } from "../../../utils/utils";
import { useTemplateManagement } from "../../../hooks/useTemplateManagement";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const PostOperativeNotes = (props) => {
  const { isEditable = true, sectionData, patientDetails = {} } = props || {};
  let { postOperativeNotes = {} } = useSelector((state) => state.otNotes);
  postOperativeNotes = props.postOperativeNotes || postOperativeNotes;
  const { profile } = useSelector((state) => state.doctors);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const dispatch = useDispatch();
  const {
    filters: { ward: wardFilters },
  } = useSelector((state) => state.inPatients);
  const handleChange = (value, key) => {
    dispatch(setPostOperativeNotes({ key, value }));
  };

  useEffect(() => {
    dispatch(fetchFilters({ field: "ward" }));
  }, []);
  const wards = useMemo(() => {
    return (
      wardFilters?.map((ward) => ({
        id: ward.id,
        name: ward.title,
      })) || []
    );
  }, [wardFilters]);

  const renderPostOpDestination = (data) => {
    const options = (wards || []).map((item) => ({
      key: JSON.stringify(item),
      value: item.name,
      label: <div key={item.id || item.masterId}>{item.name}</div>,
    }));
    if (!isEditable) {
      return (
        <div className="ipdot-ion-metrics-container">
          <ul className="ipdot-ion-metrics-list">
            <li>
              <span className="ipdot-ion-metrics-list-label">
                {data.title}
              </span>{" "}
              :{" "}
              <span className="ipdot-ion-metrics-list-value">
                {props.postOperativeNotes?.[data.id]}
              </span>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <div className="ipd-ot-notes-post-op-destination-container">
        <label className="otNotes-label">{data?.title}</label>
        <Select
          className="autocomplete-custom w-100 popinput inputheight41 "
          placeholder={data?.placeholder}
          options={options}
          value={postOperativeNotes?.[data?.id]?.value || undefined}
          onChange={(val) =>
            dispatch(setPostOperativeNotes({ key: data?.id, value: val }))
          }
        />
      </div>
    );
  };

  const doctorId =
    patientDetails?.doctor?.id || profile?.id || profile?.um_id || null;
  const defaultRichText = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );

  const getFieldValue = useCallback(
    (key) => {
      const value = props.postOperativeNotes?.[key] ?? postOperativeNotes?.[key];
      if (Array.isArray(value) && value.length) {
        return value;
      }
      if (value?.value && Array.isArray(value.value) && value.value.length) {
        return value.value;
      }
      return defaultRichText;
    },
    [postOperativeNotes, props.postOperativeNotes, defaultRichText]
  );

  const additionalInstructionsTemplate = useTemplateManagement({
    moduleName: "postOperativeAdditionalInstructions",
    templateSite: "ipd",
    doctorId,
    isEditable,
    moduleType: "richText",
    getCurrentValue: useCallback(
      () => getFieldValue("additionalInstructions"),
      [getFieldValue]
    ),
    onValueChange: useCallback(
      (data) => {
        handleChange(data, "additionalInstructions");
      },
      [handleChange]
    ),
  });

  const renderRichTextEditorWrapper = (data) => {
    const templateHandlers =
      data?.id === "additionalInstructions"
        ? additionalInstructionsTemplate
        : null;
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        data-testid={data?.id}
        width="100%"
        icon={isEditable ? otNotesIcons[data?.id]: null}
        showAutoFill={false}
        containerClass={`wrapper-class ${
          !isEditable
            ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
            : ""
        }`}
        showMagicPenGif={false}
        onErase={() => {
          handleChange(defaultRichText, data?.id);
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [data?.id]: ["clear"],
          }));
        }}
        newAutoFillTextToAppend={autoFillTextToAppend[data?.id]}
        setNewAutoFillTextToAppend={(value) => {
          setAutoFillTextToAppend((prev) => ({
            ...prev,
            [data?.id]: value,
          }));
        }}
        showMicrophone={false}
        templates={templateHandlers?.templates}
        templateType={templateHandlers ? "entries" : undefined}
        showTempButtons={isEditable && !!templateHandlers}
        onTemplate={templateHandlers?.refreshTemplates}
        onTemplateSelected={templateHandlers?.handleTemplateSelected}
        addTemplate={templateHandlers?.handleAddTemplate}
        updateTemplate={templateHandlers?.handleUpdateTemplate}
        onDeleteTemplateClicked={templateHandlers?.handleDeleteTemplate}
        loading={templateHandlers?.templatesLoading}
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={getFieldValue(data?.id)}
        onSave={() => {}}
        placeholder={data?.placeholder}
      />
    )
  }

  const renderRichTextEditorSection = (data) => {
    if (!isEditable && isEmptyRichText(postOperativeNotes?.[data?.id])) return null;
    if (!isEditable) {
      return (
        <ul>
          <li>
            {renderRichTextEditorWrapper(data)}
          </li>
        </ul>
      )
    }
    return renderRichTextEditorWrapper(data);
  };
  const renderChildren = () => {
    return sectionData?.children
      ?.filter((item) => item.enabled)
      .map((item) => {
        switch (item?.id) {
          case "postOpDestination":
            return renderPostOpDestination(item);
            case "additionalInstructions":
            return renderRichTextEditorSection(item);
          default:
            return null;
        }
      });
  };
  if (!sectionData) return null;
  if (!isEditable && hasNoData(postOperativeNotes)) {
    return null;
  }
  return (
    <div className="ipd-ot-notes-post-op-container">
      <CollapsibleWrapper
        title={sectionData?.title}
        data-testid={sectionData?.id}
        icon={sectionData?.id ? otNotesIcons[`${sectionData.id}Dark`] : null}
        collapsible={isEditable}
        width={"100%"}
        className={`collapsible-wrapper-class ${
          isEditable
            ? ""
            : "collapsible-wrapper-class-readonly ipdot-ion-readonly ipdot-pon-readonly  readonly-container-box"
        }`}
        defaultOpen
      >
        {renderChildren()}
      </CollapsibleWrapper>
    </div>
  );
};

export default PostOperativeNotes;
