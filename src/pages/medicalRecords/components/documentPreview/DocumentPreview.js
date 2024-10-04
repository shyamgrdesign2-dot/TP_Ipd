import { Button } from "antd";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "./DocumentPreview.scss";

const DocumentPreview = ({ handlePreview, shouldShowPreview }) => {
  const zoomPluginInstance = zoomPlugin(); // Instantiate the zoom plugin

  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;

  const pdfurl =
    "https://pm-printview-uat.tatvacare.in/api/v1/printview/patient-prescription?patient_unique_id=MTQ1MDUyMjIxNDc0&tcm_id=NDkyNA==&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6IjJjQUtlOUZVYnZHUkp0TiIsIm1vYmlsZV9ubyI6Ijk3NDI2Mzk5NTgiLCJjbGluaWNfaWQiOiIzNjgiLCJob3NwaXRhbF9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsInVzZXJfaWQiOjQ5M30sImlhdCI6MTcxNTA4NTg0NSwiZXhwIjoxNzQ2NjQzNDQ1fQ.iHe9R3VYqLHePwUFM8EzMnFlPum3Amgk7ui-TIJBfpU";

  return (
    <div>
      <Navbar className="headerprescription p-0">
        <Container fluid className="h-100 gx-0 w-100">
          <Row className="h-100 align-items-center w-100 justify-content-between">
            <Col sm="auto" md="auto" lg="auto" className="h-100 w-auto">
              <div className="align-items-center d-flex h-100">
                <div className="border-end h-100 text-center">
                  <div
                    // onClick={}
                    className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                  >
                    <i className="icon-right"></i>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm="autop" md="auto" lg="auto" className="h-100  w-auto">
              <div className="align-items-center d-flex h-100 gap-4">
                <i
                  className="icon-download"
                  style={{ cursor: "pointer", color: "white" }}
                />

                <i
                  className="icon-delete"
                  style={{ cursor: "pointer", color: "white" }}
                />
                <i
                  className="icon-Edit"
                  style={{ cursor: "pointer", color: "white" }}
                />
                <Button className="btn btn-primary3 btn-text-white px-4 btn-41">
                  {"close"}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="controls mb-4">
          {/* Zoom Controls */}
          <ZoomOutButton />
          <ZoomInButton />
        </div>
        <div
          // className="pdf-container"
          style={{ height: "800px", width: "100%" }}
        >
          {/* PDF Viewer */}
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={pdfurl}
              plugins={[zoomPluginInstance]}
              defaultScale={0.6}
              renderTextLayer={false} // Disable text layer
              renderAnnotationLayer={false} // Optionally disable annotation layer
              // defaultScale={SpecialZoomLevel.PageFit}
            />
          </Worker>
        </div>
      </div>

      {/* option 1 */}
      {/* <EmbedPDF
        mode="modal"
        style={{ width: 900, height: 800 }}
        // companyIdentifier="yourcompany"
      >
        <a href="https://pm-printview-uat.tatvacare.in/api/v1/printview/patient-prescription?patient_unique_id=MTQ1MDUyMjIxNDc0&tcm_id=NDkyNA==&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6IjJjQUtlOUZVYnZHUkp0TiIsIm1vYmlsZV9ubyI6Ijk3NDI2Mzk5NTgiLCJjbGluaWNfaWQiOiIzNjgiLCJob3NwaXRhbF9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsInVzZXJfaWQiOjQ5M30sImlhdCI6MTcxNTA4NTg0NSwiZXhwIjoxNzQ2NjQzNDQ1fQ.iHe9R3VYqLHePwUFM8EzMnFlPum3Amgk7ui-TIJBfpU">
          Opens sample.pdf
        </a>
      </EmbedPDF> */}

      {/* option 2 */}
      <iframe
        src={
          "https://pm-printview-uat.tatvacare.in/api/v1/printview/patient-prescription?patient_unique_id=MTQ1MDUyMjIxNDc0&tcm_id=NDkyNA==&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiZG9jdG9yX3VuaXF1ZV9pZCI6IjJjQUtlOUZVYnZHUkp0TiIsIm1vYmlsZV9ubyI6Ijk3NDI2Mzk5NTgiLCJjbGluaWNfaWQiOiIzNjgiLCJob3NwaXRhbF9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsInVzZXJfaWQiOjQ5M30sImlhdCI6MTcxNTA4NTg0NSwiZXhwIjoxNzQ2NjQzNDQ1fQ.iHe9R3VYqLHePwUFM8EzMnFlPum3Amgk7ui-TIJBfpU"
        }
        // src={
        //   "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQGs1C3gXoMvlwQnUIud-Z9RRptwAGPyjum8l0n_wFc3vF5JAJE5vXbbIGxCsUbUpmHbyixsrTommyhvSgEMUfUOLp2v54EZFn7Im2vOw"
        // }
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default DocumentPreview;
