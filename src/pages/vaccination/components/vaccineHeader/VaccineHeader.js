import React, { useState, useCallback, useContext } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button, Dropdown, Menu, Popover, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import CashManagerContext from "../../../../context/CashManagerContext";
import ProfilePopover from "../../../../common/ProfilePopover";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "../../../../assets/images/alertIcon.svg";
import Preview from "./../preview/Preview";
import "./VaccineHeader.scss";
import VideoModal from "../../../../common/VideoModal";
import tutorial2 from "../../../../assets/images/tutorial2.png";
import playIcons from "../../../../assets/images/tube-icon.svg";
import { LoadingOutlined } from "@ant-design/icons";

function VaccineHeader({
  handleDrawerVaccination,
  vaccinesData,
  patientDetails,
  setPrintType,
  isVaccination,
  printLoader,
  printPopupHandler,
  handlePrintWeb,
}) {
  const vaccinationVideo = {
    link: "https://www.youtube.com/embed/o6ALwX9hPMM",
    thumbnail: "https://i.ytimg.com/vi/o6ALwX9hPMM/hqdefault.jpg",
    tmv_description: "Vaccination",
    tmv_title: "Vaccination",
  };
  const navigate = useNavigate();
  let { patient_data } = useContext(CashManagerContext);
  patient_data = { ...patient_data, ...patientDetails };

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [shouldShowPreview, setShowPreview] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [popOverVideo, setPopOverVideo] = useState(false);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  function handleMenuClick(e) {
    setPrintType(e?.key);
  }

  function previewBtnHandler() {
    setShowPreview((prevState) => !prevState);
  }

  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  const vaccinePrint = (
    <Menu>
      <Menu.Item
        key="1"
        className="btn btn-41 btn-input printMenu"
        onClick={handleMenuClick}
      >
        All
      </Menu.Item>
      <Menu.Item
        key="2"
        className="btn-41 btn btn-input"
        style={{ border: "0 !important" }}
        onClick={handleMenuClick}
      >
        Given
      </Menu.Item>
    </Menu>
  );

  const growthPrint = (
    <Menu>
      <Menu.Item
        key="1"
        className="btn btn-41 btn-input printMenu"
        onClick={printPopupHandler}
      >
        Graph
      </Menu.Item>
      <Menu.Item
        key="2"
        className="btn-41 btn btn-input"
        style={{ border: "0 !important" }}
        onClick={handlePrintWeb}
      >
        Table
      </Menu.Item>
    </Menu>
  );
  const VIDEO_CONTENT = useCallback(() => {
    return (
      <>
        <div className="video-contant rounded-4 p-20" key="oneclickrx-video">
          <div className="align-items-center d-flex justify-content-between border-bottom mb-20 pb-2">
            <div className="title-common lh-base">Video Tutorial</div>
            <Button
              className="btn btn-delete-prescription p-0"
              onClick={showHideVideoListPopover}
            >
              <i className="icon-Cross" />
            </Button>
          </div>

          <div className={`d-flex`}>
            <div className="tutorial-play me-14">
              <button
                type="button"
                onClick={() => setVideoLink(vaccinationVideo)}
              >
                <img src={playIcons} />
              </button>
              <span className="tutorial-thumb">
                <img src={vaccinationVideo.thumbnail} />
              </span>
            </div>
            <div>
              <h3 className="title-common text-welcome">
                {vaccinationVideo.tmv_title}
              </h3>
              <div className="fs-12 fontroboto fw-normal text-main">
                {vaccinationVideo.tmv_description}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }, [popOverVideo]);
  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  return (
    <Navbar className="headerprescription p-0">
      <Container fluid className="h-100 gx-0 w-100">
        <Row className="h-100 align-items-center w-100 justify-content-between">
          <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center">
                <div
                  onClick={handleDrawerVaccination}
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
                          <img className="me-3" src={alertIcon} alt="Warning" />
                          <span>
                            Are you sure you want to leave? <br />
                            You will permanently lose your data.
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="d-flex align-items-center mt-2 justify-content-end">
                          <div
                            onClick={() =>
                              navigate("/prescription", {
                                state: { patient_data: patient_data },
                              })
                            }
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
              <ProfilePopover
                patient_data={patient_data}
                locationPath={"/vaccine"}
              />
            </div>
          </Col>
          <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
            <div className="align-items-center d-flex h-100">
              <Popover
                open={popOverVideo}
                onOpenChange={showHideVideoListPopover}
                content={VIDEO_CONTENT}
                trigger="click"
                overlayClassName="pop-430 pp-0 videoTutorial"
                placement="bottom"
              >
                <button className="btn d-flex align-items-center btn-text p-0 me-20">
                  <span>
                    <img src={tutorial2} />
                  </span>
                </button>
              </Popover>
              {isVaccination && (
                <Button
                  type="button"
                  className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                  onClick={previewBtnHandler}
                  icon={<i className="icon-Preview" />}
                >
                  Preview
                </Button>
              )}
              <Dropdown overlay={isVaccination ? vaccinePrint : growthPrint}>
                <div className="btn-41 btn px-4 me-4 ant-btn-text btn-input d-flex align-items-center gap-2">
                  <i className="icon-Print" />
                  <span className="btn-input">Print</span>
                  {printLoader ? (
                    <Spin spinning={printLoader} indicator={antIcon} />
                  ) : (
                    <i
                      className="icon-right"
                      style={{ display: "block", transform: `rotate(270deg)` }}
                    />
                  )}
                </div>
              </Dropdown>
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                onClick={handleDrawerVaccination}
                icon={<i className="icon-save" />}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
        {shouldShowPreview ? (
          <Preview
            vaccinesData={vaccinesData}
            onCancel={previewBtnHandler}
            shouldShowPreview={shouldShowPreview}
          />
        ) : null}
      </Container>
      {videoLink && (
        <VideoModal videoLink={videoLink} onCancel={() => setVideoLink(null)} />
      )}
    </Navbar>
  );
}

export default React.memo(VaccineHeader);
