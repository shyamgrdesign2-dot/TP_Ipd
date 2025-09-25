import React, { useState, useMemo, useEffect } from "react";
import { createRemoteComponent } from "../../../shared/remoteComponents";
import { defaultIcons as otNotesIcons } from "../../../assets/images/indices";
import { useDispatch, useSelector } from "react-redux";
import { setPostOperativeNotes } from "../../../redux/ipd/otNotesSlice";
import { fetchFilters } from "../../../redux/ipd/inPatientsSlice";
import { Select } from "antd";
const CollapsibleWrapper = createRemoteComponent("CollapsibleWrapper");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");

const PostOperativeNotes = (props) => {
  const { isEditable = true, sectionData } = props || {};
  let { postOperativeNotes = {} } = useSelector((state) => state.otNotes);
  postOperativeNotes = props.postOperativeNotes || postOperativeNotes;
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

  const renderRichTextEditorWrapper = (data) => {
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
        onChange={(val) => handleChange(val, data?.id)}
        initialValue={
          props.postOperativeNotes?.[data?.id]?.length
            ? props.postOperativeNotes?.[data?.id]
            : postOperativeNotes?.[data?.id]?.value?.length
            ? postOperativeNotes?.[data?.id]?.value
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={data?.placeholder}
      />
    )
  }

  const renderRichTextEditorSection = (data) => {
    if (!isEditable && !postOperativeNotes?.[data?.id]) return null;
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
  if (!isEditable && !Object.values(postOperativeNotes).some((value) => value))
    return null;
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
