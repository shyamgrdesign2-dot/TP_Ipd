import React, { useState, useCallback, useContext } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import CashManagerContext from "../../../context/CashManagerContext";
import ProfilePopover from "../../../common/ProfilePopover";
import CommonModal from "../../../common/CommonModal";
import alertIcon from "../../../assets/images/alertIcon.svg";

function HeaderVaccine() {
  const navigate = useNavigate();
  const { patient_data } = useContext(CashManagerContext);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);

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

  const printBtnHandler = () => {
    console.log("printBtnHandler");
  };

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
          <Col sm="auto" md="auto" lg="auto" className="h-100  w-auto">
            <div className="align-items-center d-flex h-100">
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input"
                onClick={saveBtnHandler}
              >
                Save
              </Button>
              <Button
                type="button"
                className="btn-41 btn px-4 me-4 ant-btn-text btn-input"
                onClick={printBtnHandler}
              >
                Print
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default React.memo(HeaderVaccine);
