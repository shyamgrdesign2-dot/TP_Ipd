import React from "react";
import "./styles.scss";
import { defaultIcons as newIcons } from "../../../assets/images/indices";
import { defaultIcons } from "../../../assets/images/icons/index.js";
import {
  setCurrentCrossReferralId,
  setSingleCrossReferralData,
} from "../../../redux/ipd/crossReferralSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createRemoteComponent } from "../../../shared/remoteComponents.js";
import { isEmptyRichText } from "../../../utils/utils.js";
import MemberChip from "../components/MemberChip";

const RichTextEditor = createRemoteComponent("RichTextEditor");

const ReferralInformationView = (props) => {
  const { data, uniqueId: _id, isCollapsible = true } = props || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails } = state || {};
  const {
    relativesInformed = {},
    referringTo,
    referringDepartment,
    reasonForReferral,
  } = data || {};

  const { informedByDoctor, informedTo, informedOnDate, informedOnTime } =
    relativesInformed;
  const isCurrentDoctorReferee = informedByDoctor?.id !== referringTo?.id;
  const handleEditCrossReferral = (id) => {
    dispatch(setCurrentCrossReferralId(id));
    dispatch(setSingleCrossReferralData({ _id: id }));
    navigate("/ipd/patient-details/cross-referral", {
      state: {
        patient_data,
        patientDetails,
        isEditable: true,
        activeCrossReferralId: id,
      },
    });
  };
  if (
    !informedByDoctor?.name &&
    !referringTo?.name &&
    !referringDepartment &&
    isEmptyRichText(reasonForReferral)
  ) {
    return null;
  }
  return (
    <div
      className={`ipdcrt-section-container ${
        !isCollapsible ? "ipdcrt-painfosection-container" : ""
      }`}
    >
      {!isCollapsible && (
        <div className="collapsible-wrapper-abs-header-shadow"></div>
      )}
      <div className="heading">
        <div className="left-section">
          <img src={newIcons.basicInfoPcDark} alt="x" />
          <span>Referral Information</span>
        </div>
        {isCurrentDoctorReferee && isCollapsible && (
          <div>
            <img
              className="medical-progress__content-calendar-icon"
              style={{ fill: "#581C87", cursor: "pointer" }}
              src={defaultIcons.editDarkIcon}
              alt="Edit"
              onClick={() => handleEditCrossReferral(_id)}
              title="Edit this date's cross referral"
            />
          </div>
        )}
      </div>
      <div className="ipdcrt-section-content">
        <div className="ipdrf-chips-container">
          <MemberChip
            icon={defaultIcons.docIcon}
            label="Referred By"
            value={informedByDoctor?.name}
            role={informedByDoctor?.role}
          />
          <MemberChip
            icon={defaultIcons.docIcon}
            label="Referring To"
            value={referringTo?.name}
            role={referringTo?.role}
          />
          <MemberChip
            icon={defaultIcons.docIcon}
            label="Referring Department"
            value={referringDepartment}
          />
        </div>
        {!isEmptyRichText(reasonForReferral) && (
          <div className="ipdrf-reason-container">
            <div className="ipdrf-heading">
              <img src={newIcons.specialInstructionsPc} alt="x" />
              <span className="surgery-card__label">
                Reason for Referral
              </span>{" "}
            </div>
            <RichTextEditor
              showActionBtns={false}
              showAutoFill={false}
              showMagicPenGif={false}
              showMicrophone={false}
              showToolbar={false}
              readOnly={true}
              className={"rich-text-editor-container-readonly"}
              initialValue={reasonForReferral}
            />
          </div>
        )}
        {informedByDoctor?.name && (
          <div className="ipdrf-reason-container">
            <div className="ipdrf-info">
              <img src={newIcons.immediateManagementPc} alt="x" />
              <span className="surgery-ipdrf-info">
                <span className="info-bold-text">{informedByDoctor?.name}</span>{" "}
                informed patient’s{" "}
                <span className="info-bold-text">
                  {informedTo || "visitors"}
                </span>{" "}
                regarding the cross reference
                {informedOnDate && (
                  <>
                    {" "}
                    on <span className="info-bold-text">{informedOnDate}</span>
                  </>
                )}
                {informedOnTime && (
                  <>
                    {" "}
                    at <span className="info-bold-text">{informedOnTime}</span>
                  </>
                )}
                .
              </span>{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralInformationView;
