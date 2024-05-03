import React, { useState, useCallback, useContext } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";

import CashManagerContext from "../../../../context/CashManagerContext";
import ProfilePopover from "../../../../common/ProfilePopover";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "../../../../assets/images/alertIcon.svg";
import Preview from "./../preview/Preview";
import "./VaccineHeader.scss";

function VaccineHeader() {
  const navigate = useNavigate();
  const { patient_data } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [shouldShowPreview, setShowPreview] = useState(false);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  const checkDataFillOrNot = () => {
    if (
      true // need to add check whether user added data or not
    ) {
      showHideBackModal();
    } else {
      navigate("/", { replace: true });
    }
  };

  const saveBtnHandler = () => {
    console.log("saveBtnHandler");
  };

  function handleMenuClick(e) {
    window.alert("selected print!");
  }

  function previewBtnHandler() {
    setShowPreview((prevState) => !prevState);
  }

  const menu = (
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

  return (
    <Navbar className="justify-content-between headerprescription p-0">
      <Container fluid className="h-100 gx-0 w-100">
        <Row className="h-100 align-items-center w-100 justify-content-between">
          <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
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
                            onClick={() =>
                              navigate("/prescription", { replace: true })
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
              <ProfilePopover patient_data={patient_data} />
            </div>
          </Col>
          <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
            <div className="align-items-center d-flex h-100">
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                onClick={previewBtnHandler}
                icon={<i className="icon-Preview" />}
              >
                Preview
              </Button>
              <Dropdown overlay={menu}>
                <div className="btn-41 btn px-4 me-4 ant-btn-text btn-input d-flex align-items-center gap-2">
                  <i className="icon-Print" />
                  <span className="btn-input">Print</span>
                  <i
                    className="icon-right"
                    style={{ display: "block", transform: `rotate(270deg)` }}
                  />
                </div>
              </Dropdown>
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                onClick={saveBtnHandler}
                icon={<i className="icon-save" />}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
        {shouldShowPreview ? (
          <Preview
            onCancel={previewBtnHandler}
            shouldShowPreview={shouldShowPreview}
          />
        ) : null}
      </Container>
    </Navbar>
  );
}

export default React.memo(VaccineHeader);
