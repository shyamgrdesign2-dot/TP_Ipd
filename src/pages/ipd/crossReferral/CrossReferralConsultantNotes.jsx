import React, { Suspense, useEffect, useState, useMemo } from "react";
import { IPD } from "../../../utils/locale.js";
import "../assessmentForm/styles.scss";
import "./styles.scss";
import { Button, DatePicker, Drawer, message } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import {
  getCustomization,
  updateCustomization,
} from "../../../redux/ipd/ipdSlice.js";
import AddCustomModule from "../../../components/AddCustomModule.js";
import { useSelector } from "react-redux";
import CustomModule from "../../../components/CustomModule.js";
import {
  resetCrossReferralForm,
  setCurrentCrossReferralId,
  updateCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice.js";
import BackConfirmationModal from "../../../components/BackConfirmationModal.js";
import {
  getCrossReferralData,
  setSingleCrossReferralData,
  setCrossReferralConsultantNoteDetails,
} from "../../../redux/ipd/crossReferralSlice.js";
import ReferralInformation from "./ReferralInformation.jsx";
import ReferralInformationView from "./ReferralInformationView.jsx";
import { defaultIcons as newIcons } from "../../../assets/images/indices";
import dayjs from "dayjs";
import { defaultIcons } from "../../../assets/images/icons/index.js";

const LayoutWithMenu = createRemoteComponent("LayoutWithMenu");
const Customization = createRemoteComponent("Customization");
const FilledByCard = createRemoteComponent("FilledByCard");
const RichTextEditWrapper = createRemoteComponent("RichTextEditWrapper");
const RichTextEditor = createRemoteComponent("RichTextEditor");

const CrossReferralConsultantNotes = (props) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    patient_data,
    patientDetails,
    isEditable = true,
    fullData: { referralInformationData, id } = {},
    fromTab
  } = state || {};
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showCustomisationDrawer, setShowCustomisationDrawer] = useState(false);
  const [autoFillTextToAppend, setAutoFillTextToAppend] = useState({});
  const { customization = {} } = useSelector((state) => state.ipd);
  const crossReferralState = useSelector((state) => state.crossReferral);
  const { crossReferralFormDetails, selectedConsultantNoteId } = useSelector(
    (state) => state.crossReferral
  );
  const initialValue = useMemo(
    () =>
      crossReferralFormDetails?.consultantNotesData?.[
        selectedConsultantNoteId
      ] || {},
    [crossReferralFormDetails?.consultantNotesData, selectedConsultantNoteId]
  );
  const { customModules } = useSelector((state) => state.customModules);
  const crossReferralData = useSelector((state) => state.crossReferral);
  const { crossReferral = [] } = customization;
  const [modelData, setModelData] = useState(
    crossReferral.length > 0
      ? crossReferral
      : IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE
  );

  useEffect(() => {
    if (
      id &&
      (!crossReferralFormDetails?.referralInformation?.referringTo ||
        !crossReferralFormDetails?.referralInformation?.referringDepartment)
    ) {
      dispatch(setCurrentCrossReferralId(id));
      dispatch(setSingleCrossReferralData({ _id: id }));
    }
  }, [
    id,
    crossReferralFormDetails?.referralInformation?.referringTo,
    crossReferralFormDetails?.referralInformation?.referringDepartment,
    crossReferralData,
  ]);

  useEffect(() => {
    if (crossReferral.length > 0) {
      setModelData(crossReferral);
    }
  }, [crossReferral]);

  useEffect(() => {
    dispatch(getCustomization());
    if (patientDetails?.details?.id && patientDetails?.admissionId) {
      dispatch(
        getCrossReferralData({
          patientId: patientDetails.details.id,
          admissionId: patientDetails.admissionId,
        })
      ).then((res) => {
        if (crossReferralData.currentCrossReferralId) {
          dispatch(
            setSingleCrossReferralData({
              _id: crossReferralData.currentCrossReferralId,
            })
          );
        }
      });
    }
  }, [patientDetails?.details?.id, patientDetails?.admissionId]);

  const handleChange = (value, key) => {
    if (!isEditable) return;
    dispatch(setCrossReferralConsultantNoteDetails({ [key]: value }));
  };

  const handleDefaultClick = () => {
    setModelData(IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE);
    setShowCustomisationDrawer(false);
    const newData = {
      ...customization,
      crossReferral: IPD.DEFAULT_CROSS_REFERRAL_FORM_STRUCTURE,
    };
    dispatch(updateCustomization(newData));
  };

  const renderRichTextEditorSection = (data, showOnlyEditorToolbar = false) => {
    if (!isEditable && !crossReferralFormDetails?.[data?.id]) return null;
    if (showOnlyEditorToolbar) {
      return (
        <>
          <div className="d-flex-align-center-gap-8">
            <img src={newIcons[`${data?.id}Pc`]} alt="x" />
            <div className="rich-text-editor-wrapper-header-title">
              {data?.title}
            </div>
          </div>
          <RichTextEditor
            showAutoFill={false}
            showMagicPenGif={false}
            showMicrophone={false}
            showToolbar={true}
            readOnly={false}
            className={"rich-text-editor-container"}
            onChange={(val) => handleChange(val, data?.id)}
            initialValue={
              initialValue?.[data?.id]
                ? initialValue?.[data?.id]
                : [
                    {
                      type: "paragraph",
                      children: [{ text: "" }],
                    },
                  ]
            }
            placeholder={data?.placeholder}
          />
        </>
      );
    }
    return (
      <RichTextEditWrapper
        readOnly={!isEditable}
        showToolbar={isEditable}
        showActionBtns={isEditable}
        title={data?.title}
        width="100%"
        icon={newIcons[`${data?.id}Pc`]}
        showAutoFill={false}
        containerClass={` ${
          !isEditable
            ? "ipd-wrapper-class-readonly rich-text-editor-container-readonly ipdot-on-extraMargin"
            : "rich-text-editor-wrapper-bg"
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
          initialValue?.[data?.id]
            ? initialValue?.[data?.id]
            : [
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
              ]
        }
        placeholder={data?.placeholder}
      />
    );
  };

  const renderSections = (data) => {
    if (!data || !data.id) {
      return null;
    }

    return (
      <div className="ipd-otnotes-editable-section-container">
        {(() => {
          switch (data.id) {
            case "referralInformation":
              return (
                <ReferralInformationView
                  data={referralInformationData}
                  uniqueId={id}
                  isCollapsible={false}
                />
              );
            case "clinicalAssessment":
              return renderRichTextEditorSection(data, false);
            case "additionalRemarksAndFollowUp":
              return (
                <div className="ipd-crosref-consult-addremarks-container">
                  {data?.children.map((grandChildItem) => {
                    switch (grandChildItem?.id) {
                      case "additionalRemarks":
                        return renderRichTextEditorSection(
                          grandChildItem,
                          true
                        );
                      case "followUp":
                        const dateDisplayFormat = "D MMM YYYY";
                        return (
                          <div>
                            <div className="otNotes-label">
                              {grandChildItem?.title}
                            </div>
                            <DatePicker
                              className="w-25 popinput inputheight41"
                              format={{
                                format: dateDisplayFormat,
                                type: "mask",
                              }}
                              value={
                                initialValue?.[grandChildItem?.id]
                                  ? dayjs(
                                      initialValue?.[grandChildItem?.id],
                                      dateDisplayFormat
                                    )
                                  : null
                              }
                              placeholder={"dd/mm/yyyy"}
                              onChange={(date) =>
                                dispatch(
                                  setCrossReferralConsultantNoteDetails({
                                    [grandChildItem?.id]: date
                                      ? date.format(dateDisplayFormat)
                                      : "",
                                  })
                                )
                              }
                              suffixIcon={
                                <img src={defaultIcons.calendarPlainIcon} alt="calendar" />
                              }
                              prefix={null}
                              allowClear
                              inputReadOnly
                            />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              );
            case "impression":
              return renderRichTextEditorSection(data, false);
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  const handleSaveCustomization = () => {
    setShowCustomisationDrawer(false);
    const newData = { ...customization, crossReferral: [...modelData] };
    dispatch(updateCustomization(newData));
  };

  const onAddReferralClick = () => {
    const consultantNotesData = crossReferralState.crossReferralFormDetails.consultantNotesData || [];
    
    const reqData = {
      ...crossReferralState.crossReferralFormDetails,
      consultantNotes: consultantNotesData,
      customModule: [],
    };

    delete reqData.consultantNotesData;

    console.log("cross referral ==> REQ", reqData);

    dispatch(
      updateCrossReferralData({
        data: reqData,
        patientId: patientDetails?.details?.id,
        admissionId: patientDetails?.admissionId,
        _id: crossReferralState?.currentCrossReferralId || null,
      })
    ).then((res) => {
      if (res?.payload?.error) {
        message.warning(
          `${res.payload.error} - ${
            res.payload.message?.split("must")?.[0]
          } missing`
        );
        return;
      }
      dispatch(
        getCrossReferralData({
          patientId: patientDetails?.details?.id,
          admissionId: patientDetails?.admissionId,
          _id: crossReferralState.currentCrossReferralId,
        })
      );
      message.success('Cross Referral Consultant Notes Added Successfully');
      navigate("/ipd/patient-details", {
        state: {
          isEditable: false,
          patient_data: patient_data,
          patientDetails,
          activeTab: "crossReferral",
          fromTab
        },
        replace: true,
      });
    });
  };

  const renderBottomSection = () => {
    return (
      <div className="ipd-custom-module-container">
        {customModules?.map((customModule) => {
          return (
            <CustomModule module={customModule} patient_data={patient_data} />
          );
        })}
        <AddCustomModule />
      </div>
    );
  };

  const renderHeaderSection = () => {
    return (
      <div className="ipd-filled-by-card-container">
        {crossReferralState.currentCrossReferralFilledByDetails
          ?.createdByName && (
          <FilledByCard
            showBeing={
              !crossReferralState.currentCrossReferralFilledByDetails?.createdAt
            }
            filledBy={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByName || ""
            }
            role={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdByRole || ""
            }
            showFilledOnDate={true}
            selectedDate={
              crossReferralState.currentCrossReferralFilledByDetails
                ?.createdAt || ""
            }
          />
        )}
      </div>
    );
  };

  const renderAllSections = () => {
    return (
      <div
        className={`ipd-generic-form-container ipd-otnotes-form-container ${
          !isEditable ? "ipd-assessments-readable-container" : ""
        }`}
      >
        {crossReferral.length > 0
          ? crossReferral.map((item) => {
              return renderSections(item);
            })
          : null}
      </div>
    );
  };

  const onMenuItemClick = (activeId) => {
    console.log("INTEL ==> activeId", activeId);
  };

  // Early return if essential data is missing to prevent undefined errors
  if (!patientDetails && isEditable) {
    return <div>Loading patient details...</div>;
  }

  return (
    <div
      className={`afipd-otnotes-form-container ${
        isEditable ? "" : "ipd-otnotes-form-container-readonly"
      }`}
    >
      <Suspense fallback={<>Loading ...</>}>
        {!isEditable ? (
          <div>{renderAllSections()}</div>
        ) : (
          <div
            className={`ipd-cross-ref-consult-form-container ${
              !isEditable ? "ipd-assessments-readable-container" : ""
            }`}
          >
            {open && modelData && (
              <LayoutWithMenu
                onCustomiseClick={() => setShowCustomisationDrawer(true)}
                key="crossReferral"
                title={"Cross Referral"}
                mainCta={{
                  handler: onAddReferralClick,
                  title: "Add Referral",
                }}
                items={modelData}
                renderSection={renderSections}
                onRequestClose={() => {
                  setIsBackModalOpen(true);
                }}
                renderHeaderSection={renderHeaderSection}
                headerOffset={72}
                onMenuItemClick={onMenuItemClick}
              />
            )}
          </div>
        )}
      </Suspense>
      {showCustomisationDrawer && (
        <Drawer
          closeIcon={true}
          width={"70%"}
          placement="right"
          className="customise-form-ipd-container"
          title="Customise Your Form"
          open={showCustomisationDrawer}
          onClose={() => setShowCustomisationDrawer(false)}
          extra={
            <>
              <Button
                type="button"
                onClick={handleDefaultClick}
                className="btn-41 btn text-underline"
                loading={false}
                disabled={false}
              >
                Default Settings
              </Button>
              <Button
                type="button"
                onClick={handleSaveCustomization}
                className="btn-41 btn px-4 btn-primary3"
                loading={false}
                disabled={false}
              >
                Save
              </Button>
            </>
          }
        >
          <Suspense fallback={<>Loading ...</>}>
            <div className="customise-form-ipd-container-inner">
              <Customization
                onModelChange={(e) => {
                  setModelData(e);
                }}
                customModel={modelData}
              />
            </div>
          </Suspense>
        </Drawer>
      )}
      <BackConfirmationModal
        isModalOpen={isBackModalOpen}
        onCancel={() => setIsBackModalOpen(false)}
        onConfirm={() => {
          setIsBackModalOpen(false);
          navigate(`/ipd/patient-details`, {
            state: { ...state, activeTab: "crossReferral", isEditable: false, fromTab },
            replace: true,
          });
          dispatch(resetCrossReferralForm());
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CrossReferralConsultantNotes;
