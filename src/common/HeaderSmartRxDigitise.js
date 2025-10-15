import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import {
  Button,
  Dropdown,
  Tooltip,
  Popover,
  Input,
  Spin,
  Tabs,
  Select,
  Drawer,
  message,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

import CashManagerContext from "../context/CashManagerContext";
import ProfilePopover from "./ProfilePopover";
import CommonModal from "./CommonModal";
import alertIcon from "../assets/images/alertIcon.svg";
import reload from "../assets/images/ic_Reload.svg";
import tutorial from "../assets/images/tutorial.svg";
import playIcons from "../assets/images/tube-icon.svg";
import api from "../api/services/axiosService";

import { errorMessage, removeBeforeWhiteSpace } from "../utils/utils";

import { useSelector, useDispatch } from "react-redux";

import VideoModal from "./VideoModal";
import { getDecodedToken } from "../utils/localStorage";
import { env } from "../EnvironmentConfig";
import {
  RX_DIGITIZATION,
  IS_RX_DIGI_API_CALL,
  S_RX_DIGITIZATION,
} from "../utils/constants";
import ReconnectingWebSocket from "reconnectingwebsocket";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { GB_SMARTSYNC_CONNECT } from "../utils/constants";
import FreeTrialButton from "../pages/monetization/components/FreeTrialButton";
import ExpiredSubModal from "../pages/monetization/components/ExpiredSubModal";
import {
  getClinic,
  getTokenData,
} from "../utils/utils";

function HeaderSmartRxDigitise({ onSave, patient_data, isSnapRx = false, isDigitiseRxLoading = false, tcm_id }) {
  const { profile } = useSelector(
      (state) => state.doctors
    );
  const { templates, loading } = useSelector((state) => state.caseManager);
  const { videoList } = useSelector((state) => state.doctors);
  const [videoLink, setVideoLink] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [popOverVideo, setPopOverVideo] = useState(false);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);
  const handleSaveDigitiseRx = async () => {
        const tokenData = getTokenData();
        const clinic = getClinic(profile?.hospital_data);
        window.Moengage.track_event("TP_SubmitDigitizedRx", {
        patient_id: patient_data?.patient_unique_id || "",
        patient_name: patient_data?.pm_fullname || "",
        doctor_id: profile?.doctor_unique_id,
        doctor_name: profile?.um_name,
        doctor_specialty: profile?.dp_name,
        clinic_id: tokenData?.clinic_id,
        clinic_name: clinic?.hm_name,
        rx_id: tcm_id || patient_data?.tcm_id || "",
        source: "Patient Details page",
        device_details: navigator.userAgent
      });
    onSave();
  };

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback(() => {
    return (
      <>
        <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
          <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
            <div className="title-common-digitised lh-base">Video Tutorial</div>
            <Button
              className="btn btn-videoClose p-0"
              onClick={showHideVideoListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>
          {videoList
            ?.filter((e) => e.category_id === 9)[0]
            ?.video?.map((item1, i1) => {
              return (
                <div
                  key={i1}
                  className={`d-flex ${
                    i1 !==
                      videoList?.filter((e) => e.category_id === 9)[0]?.video
                        ?.length -
                        1 && "pb-3 mb-15 border-bottom"
                  }`}
                >
                  <div className="tutorial-play me-14">
                    <button type="button" onClick={() => setVideoLink(item1)}>
                      <img src={playIcons} />
                    </button>
                    <span className="tutorial-thumb">
                      <img src={item1.thumbnail} />
                    </span>
                  </div>
                  <div>
                    <h3 className="title-common-digitised text-welcome">
                      {item1?.tmv_title}
                    </h3>
                    <div className="fs-12 fontroboto fw-normal text-main">
                      {item1?.tmv_description}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }, [popOverVideo]);

  const showHideSubModal = useCallback(() => {
    setIsSubModalOpen(!isSubModalOpen);
  }, [isSubModalOpen]);

  return (
    <>
      <Navbar
        className={`justify-content-between headerprescription p-0 ${
          isSnapRx ? "header-snap-rx-nav" : ""
        }`}
      >
        <Container fluid className={`gx-0 w-100 ${!isSnapRx ? "h-100" : ""}`}>
          <Row
            className={`align-items-center w-100 justify-content-between ${
              isSnapRx ? "header-snap-rx" : "h-100"
            }`}
          >
            <Col lg="auto" className="h-100 p-0">
              <div className="align-items-center d-flex h-100">
                <div className="border-end h-100 text-center">
                  <div
                    onClick={showHideBackModal}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right"></i>
                  </div>
                  <CommonModal
                    isModalOpen={isBackModalOpen}
                    onCancel={showHideBackModal}
                    modalWidth={500}
                    title={"You may lose your data"}
                    modalBody={
                      <>
                        <div className="alert-warning rounded-10px p-2 patient-details">
                          <div className="d-flex align-items-center">
                            <img
                              className="me-3"
                              src={alertIcon}
                              alt="Warning"
                            />
                            <span>
                              Are you sure you want to leave? <br />
                              You will permanently lose your data.
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="d-flex align-items-center mt-2 justify-content-end">
                            <div
                              onClick={() => navigate(-1)}
                              className="me-4 text-decoration-underline btn p-0 text-main"
                            >
                              Yes Leave
                            </div>
                            <Button
                              onClick={showHideBackModal}
                              className="lh-lg btn btn-primary3 btn-41 px-4"
                            >
                              <span>No, Stay</span>
                            </Button>
                          </div>
                        </div>
                      </>
                    }
                  />
                </div>
                <div className="p-4">{`Review & Save ${patient_data?.pm_fullname}'s Digital Rx`}</div>
              </div>
            </Col>
            <Col lg="auto">
              <div className="align-items-center d-flex h-100">
                <FreeTrialButton
                  title={S_RX_DIGITIZATION}
                  showHideSubModal={showHideSubModal}
                />

                {isSnapRx ? <Popover
                  open={popOverVideo}
                  onOpenChange={showHideVideoListPopover}
                  content={VIDEO_CONTENT}
                  trigger="click"
                  overlayClassName="pop-430 pp-0 videoTutorial"
                  placement="bottom"
                >
                  <button className="btn d-flex align-items-center btn-text mx-3 tutorial p-0">
                    <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
                      <img height={42} src={tutorial} />
                      Tutorial
                    </span>
                  </button>
                </Popover> : null}
                {videoLink && (
                  <VideoModal
                    videoLink={videoLink}
                    onCancel={() => setVideoLink(null)}
                  />
                )}
                <Button
                  type="button"
                  className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
                  onClick={handleSaveDigitiseRx}
                  loading={loading}
                  disabled={isDigitiseRxLoading}
                >
                  Save Digitised Rx
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <ExpiredSubModal
        title={S_RX_DIGITIZATION}
        isSubModalOpen={isSubModalOpen}
        showHideSubModal={showHideSubModal}
      />
    </>
  );
}

export default React.memo(HeaderSmartRxDigitise);
