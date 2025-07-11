import React, { useState, useCallback, useContext } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button, Popover } from "antd";
import { useNavigate } from "react-router-dom";

import CashManagerContext from "../../../context/CashManagerContext";
import ProfilePopover from "../../../common/ProfilePopover";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";
import tutorial from "../../../assets/images/tutorial.svg";
import playIcons from "../../../assets/images/tube-icon.svg";
import "./Header.scss";

import { useSelector, useDispatch } from "react-redux";

import VideoModal from "../../../common/VideoModal";

function Header({
  prescription,
  onClear,
  onSubmit,
  smartRxData,
  loader,
  onUploadMore,
  showUploadMoreButton,
}) {
  const { loading } = useSelector((state) => state.caseManager);
  const { videoList } = useSelector((state) => state.doctors);
  const [videoLink, setVideoLink] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { patient_data, tcmId, pamId } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [popOverVideo, setPopOverVideo] = useState(false);
  const [clicked, setClicked] = useState(false);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const showHideClearModal = useCallback(() => {
    setIsClearModalOpen(!isClearModalOpen);
  }, [isClearModalOpen]);

  const checkDataFillOrNot = () => {
    if (smartRxData && smartRxData?.length) {
      showHideBackModal();
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleClearClick = () => {
    setIsClearModalOpen(!isClearModalOpen);
    onClear(); // Call the parent's clear handler
  };

  const handleSubmitClick = async () => {
    if (!clicked) {
      onSubmit();
    }
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
            <div className="title-common lh-base">Video Tutorial</div>
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
                      <img src={playIcons} alt="play" />
                    </button>
                    <span className="tutorial-thumb">
                      <img src={item1.thumbnail} alt="thumbnail" />
                    </span>
                  </div>
                  <div>
                    <h3 className="title-common text-welcome">Snap Rx</h3>
                    <div className="fs-12 fontroboto fw-normal text-main">
                      This is a tutorial for Snap Rx.
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }, [popOverVideo]);

  return (
    <Navbar className="justify-content-between headerprescription p-0">
      <Container fluid className="h-100 gx-0 w-100">
        <Row className="h-100 align-items-center w-100 justify-content-between">
          <Col lg="auto" className="h-100">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center">
                <div
                  onClick={checkDataFillOrNot}
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
                            onClick={() => navigate("/", { replace: true })}
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
              <ProfilePopover patient_data={patient_data} />
            </div>
          </Col>
          <Col lg="auto">
            <div className="align-items-center d-flex h-100">
              <Popover
                open={popOverVideo}
                onOpenChange={showHideVideoListPopover}
                content={VIDEO_CONTENT}
                trigger="click"
                overlayClassName="pop-430 pp-0 videoTutorial"
                placement="bottom"
              >
                <button className="btn d-flex align-items-center btn-text me-10 tutorial">
                  <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
                    <img height={42} src={tutorial} alt="tutorial" />
                    Tutorial
                  </span>
                </button>
              </Popover>
              {videoLink && (
                <VideoModal
                  videoLink={videoLink}
                  onCancel={() => setVideoLink(null)}
                />
              )}

              <CommonModal
                isModalOpen={isClearModalOpen}
                onCancel={showHideClearModal}
                modalWidth={500}
                title={"You may lose your data"}
                modalBody={
                  <>
                    <div className="alert-warning rounded-10px p-2 patient-details">
                      <div className="d-flex align-items-center">
                        <img className="me-3" src={alertIcon} alt="Warning" />
                        <span>
                          Are you sure you want to clear all the <br />
                          prescription pages data?
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="d-flex align-items-center mt-2 justify-content-end">
                        <div
                          onClick={() => handleClearClick()}
                          className="me-4 text-decoration-underline btn p-0 text-main"
                        >
                          Clear
                        </div>
                        <Button
                          onClick={showHideClearModal}
                          className="lh-lg btn btn-primary3 btn-41 px-4"
                        >
                          <span>No</span>
                        </Button>
                      </div>
                    </div>
                  </>
                }
              />
              {showUploadMoreButton && <Button
                type="button"
                className="me-20 upload-more-btn"
                onClick={onUploadMore}
              >
                <i className="icon-upload" style={{ color: "#4B4AD5" }}></i>
                <span>Upload more</span>
              </Button>}
              <Button
                type="button"
                className="btn align-items-center d-flex btn-41 btn-primary3 me-20"
                onClick={handleSubmitClick}
                loading={loading}
                disabled={!prescription && clicked}
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default React.memo(Header);
