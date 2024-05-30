import React, { useState, useCallback, useContext, useRef } from "react";
import { Container, Navbar, Row, Col } from "react-bootstrap";
import { Button, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";

import CashManagerContext from "../../../../context/CashManagerContext";
import ProfilePopover from "../../../../common/ProfilePopover";
import CommonModal from "../../../../common/CommonModal";
import alertIcon from "../../../../assets/images/alertIcon.svg";
import Preview from "./../preview/Preview";
import "./VaccineHeader.scss";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function VaccineHeader({
  handleDrawerVaccination,
  vaccinesData,
  patientDetails,
  setPrintType,
}) {
  const navigate = useNavigate();
  let { patient_data } = useContext(CashManagerContext);
  patient_data = { ...patient_data, ...patientDetails };

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [shouldShowPreview, setShowPreview] = useState(false);

  const showHideBackModal = useCallback(() => {
    setIsBackModalOpen(!isBackModalOpen);
  }, [isBackModalOpen]);

  function handleMenuClick(e) {
    setPrintType(e?.key);
  }

  function previewBtnHandler() {
    setShowPreview((prevState) => !prevState);
  }

  const iframeRef = useRef(null);

  const generatePDF = () => {
    const documentDefinition = {
      content: [
        {
          text: "Hello world!",
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          text: "This is a PDF generated using pdfmake in React.",
          fontSize: 14,
          alignment: "justify",
        },
        {
          text: "You can add more content as needed.",
          fontSize: 14,
          alignment: "justify",
          margin: [0, 10, 0, 0],
        },
      ],
    };

    // Create a PDF document
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    // Get the PDF content as a blob
    pdfDocGenerator.getBlob((blob) => {
      // Create a blob URL for the PDF content
      const url = URL.createObjectURL(blob);

      // Set the PDF content in the iframe
      iframeRef.current.src = url;
    });
  };

  const vaccinePrint = (
    <Menu>
      <Menu.Item
        key="1"
        className="btn btn-41 btn-input printMenu"
        onClick={generatePDF}
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
    <>
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
                {
                  <Button
                    type="button"
                    className="btn-41 btn px-4 me-4 ant-btn-text btn-input align-items-center d-flex"
                    onClick={previewBtnHandler}
                    icon={<i className="icon-Preview" />}
                  >
                    Preview
                  </Button>
                }
                <Dropdown overlay={vaccinePrint}>
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
      </Navbar>
      <iframe
        ref={iframeRef}
        title="PDF Viewer"
        width="100%"
        height="500px"
        style={{ border: "none" }}
      />
    </>
  );
}

export default React.memo(VaccineHeader);
