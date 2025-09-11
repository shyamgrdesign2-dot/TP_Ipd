import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Select, Button, Popover, Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { isChrome, isSafari } from "react-device-detect";

import Slider from "react-slick";

import playIconutube from "../../../assets/images/play-icon.png";
import tutorial from "../../../assets/images/tutorial-icon.svg";
import playIcons from "../../../assets/images/tube-icon.svg";

import { changeHospital } from "../../../redux/doctorsSlice";
import { useLocalStorage } from "../../../utils/localStorage";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";
import { getClinicName } from "../../../utils/utils"; 
import VideoModal from "../../../common/VideoModal";

function IPDHeader({ locationPath }) {
  const [popOverVideo, setPopOverVideo] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [videoDrawer, setvideoDrawer] = useState(false);

  const sliderSettings = {
    className: "center",
    dots: true,
    arrows: false,
    centerMode: true,
    infinite: false,
    centerPadding: "5px",
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const navigate = useNavigate();

  const { profile, videoList } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [getToken, setToken] = useLocalStorage(
    PERSISTANT_STORAGE_KEY_AUTH_TOKEN
  );

  useEffect(() => {
    if (profile) {
      const clinics = profile.hospital_data?.map((e) => {
        return {
          value: e.hm_id,
          label: e.hm_name,
        };
      });
      setClinicOptions(clinics);
    }
  }, [profile]);

  useEffect(() => {
    if (clinicOptions?.length > 0) {
      const getStorageData = async () => {
        const token = await getToken();
        if (token !== undefined) {
          try {
            var decoded = jwtDecode(token);

            const index = clinicOptions.findIndex(
              (e) => e.value == decoded.result.clinic_id
            );
            index !== -1
              ? setSelectedHospital(parseInt(decoded.result.clinic_id))
              : setSelectedHospital(null);
          } catch (e) {
            console.log(e);
          }
        }
      };
      getStorageData();
    }
  }, [clinicOptions]);

  const HOSPITAL_DATA = useMemo(() => {
    return (
      <Select
        placeholder="Clinic Name"
        className="me-2"
        defaultValue={selectedHospital ? selectedHospital : "Clinic Name"}
        value={selectedHospital ? selectedHospital : "Clinic Name"}
        onChange={async (value) => {
          const sendData = {
            clinic_id: value,
          };
          const action = await dispatch(changeHospital(sendData));
          if (action.meta.requestStatus === "fulfilled") {
            // setSelectedHospital(value)
            await setToken(action.payload.token);

            if (locationPath == "/") {
              if (!isChrome && !isSafari) {
                navigate("/?authToken=" + action.payload.token, {
                  replace: true,
                });
                navigate(0, { replace: true });
              } else {
                navigate("/", { replace: true });
                navigate(0, { replace: true });
              }
            } else {
              navigate(0, { replace: true });
            }
          }
        }}
        options={clinicOptions}
      />
    );
  }, [selectedHospital, clinicOptions, locationPath]);

  //DrawerVideo function
  const handleDrawervideo = useCallback(() => {
    window.Moengage.track_event("video_library_button_clicked");
    setvideoDrawer(!videoDrawer);
  }, [videoDrawer]);

  //PopOverVideo function
  const showHideVideoListPopover = useCallback(() => {
    setPopOverVideo(!popOverVideo);
  }, [popOverVideo]);

  //Video Componet
  const VIDEO_CONTENT = useCallback(
    (categoryId) => {
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
            {videoList
              ?.filter((e) => e.category_id === categoryId)[0]
              ?.video?.map((item1, i1) => {
                return (
                  <div
                    key={i1}
                    className={`d-flex ${
                      i1 !==
                        videoList?.filter(
                          (e) => e.category_id === categoryId
                        )[0]?.video?.length -
                          1 && "pb-3 mb-15 border-bottom"
                    }`}
                  >
                    <div className="tutorial-play me-14">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoLink(item1);
                          const clinic_name = getClinicName(
                            profile?.hospital_data
                          );
                          window.Moengage.track_event("TP_Tutorial_Viewed", {
                            clinic_name,
                            tutorial_type: videoList[0]?.category,
                          });
                        }}
                      >
                        <img src={playIcons} />
                      </button>
                      <span className="tutorial-thumb">
                        <img src={item1.thumbnail} />
                      </span>
                    </div>
                    <div>
                      <h3 className="title-common text-welcome">
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
    },
    [popOverVideo]
  );

  return (
    <>
      <Navbar className="justify-content-between portal-header">
        <Container fluid>
          <i
            className="icon-right cursor-pointer"
            onClick={() => navigate("/")}
          ></i>

          <div className="fw-semibold">IPD</div>

          <Nav className="ms-auto align-items-center d-flex">
            <Popover
              open={popOverVideo}
              onOpenChange={showHideVideoListPopover}
              content={VIDEO_CONTENT(3)}
              trigger="click"
              overlayClassName="pop-430 pp-0 videoTutorial"
              placement="bottom"
            >
              <button className="btn d-flex align-items-center btn-text mx-3 tutorial p-0">
                {/* onClick={showHideVideoListPopover} */}
                <span className="text-decoration-none rounded-5 pe-3 bg-white shadow2">
                  <img height={42} src={tutorial} alt="tutorial" />
                  Tutorial
                </span>
              </button>
            </Popover>
            {HOSPITAL_DATA}

            <Drawer
              title="Video Tutorial"
              placement="right"
              onClose={handleDrawervideo}
              open={videoDrawer}
              className="modalWidth-400 tab345 playdrawer"
              width="auto"
            >
              <div className="mt-20">
                {videoList?.map((item, i) => {
                  return (
                    item?.video?.length > 0 && (
                      <div key={i} className=" ms-4 video-bottom-spacing">
                        <div className="title-common text-welcome">
                          {item?.category}
                        </div>
                        <div className="fs-12 fontroboto fw-normal text-main">
                          {item?.description}
                        </div>
                        <div className="videodrawer-left mt-3">
                          <Slider {...sliderSettings}>
                            {item?.video?.map((item1, i1) => {
                              return (
                                <div key={i1} className="drawer-slider">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVideoLink(item1);
                                      const clinic_name = getClinicName(
                                        profile?.hospital_data
                                      );
                                      window.Moengage.track_event(
                                        "TP_Tutorial_Viewed",
                                        {
                                          clinic_name,
                                          tutorial_type: item?.category,
                                        }
                                      );
                                    }}
                                  >
                                    <img src={playIconutube} />
                                  </button>
                                  <img src={item1?.thumbnail} />
                                </div>
                              );
                            })}
                          </Slider>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </Drawer>

            {videoLink && (
              <VideoModal
                videoLink={videoLink}
                onCancel={() => setVideoLink(null)}
              />
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default React.memo(IPDHeader);
