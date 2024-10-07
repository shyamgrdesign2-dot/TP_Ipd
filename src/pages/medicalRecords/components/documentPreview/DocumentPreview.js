import { Button, Card } from "antd";
import { Worker, Viewer, RotateDirection } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "./DocumentPreview.scss";
import { useEffect, useRef, useState } from "react";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { rotatePlugin } from "@react-pdf-viewer/rotate";
import clockwise from "./../../../../assets/images/clockwise-direction.svg";
import anticlockwise from "./../../../../assets/images/anticlockwise-direction.svg";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { useSelector } from "react-redux";
import { isChrome, isSafari } from "react-device-detect";
import dayjs from "dayjs";

const DocumentPreview = ({
  onClose,
  cardData,
  handleEdit,
  toggleDeletePopup,
  handleInAppDownload,
  handleDownload,
}) => {
  const { uploadDocCategories } = useSelector((state) => state.uploadDoc);
  const categoryName = uploadDocCategories.find(
    (item) => item.category_id === cardData?.category_id
  )?.category_name;
  const [scale, setScale] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const zoomPluginInstance = zoomPlugin();
  const rotatePluginInstance = rotatePlugin();
  const { Rotate } = rotatePluginInstance;
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const [isPdf, setIsPdf] = useState(true);
  const imgRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (cardData?.url?.includes(".pdf")) {
      setIsPdf(true);
    } else {
      setIsPdf(false);
      setNumberOfPages(1);
    }
  }, [cardData]);

  const rotateLeft = () => {
    setAngle((prevAngle) => prevAngle - 90);
  };

  const rotateRight = () => {
    setAngle((prevAngle) => prevAngle + 90);
  };

  const onLoadSuccess = (pdfDocument) => {
    setNumberOfPages(pdfDocument?.doc?._pdfInfo?.numPages || 0);
  };

  const onPageChange = (e) => {
    setCurrentPage(e.currentPage + 1);
  };

  const handleOnZoom = (zoomCount) => {
    setScale(zoomCount?.scale);
  };

  const Controls = ({ handleImgZoomOut, handleImgZoomIn }) => {
    return (
      <div
        className="controls mb-4 d-flex align-items-center"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          borderRadius: 12,
          columnGap: 30,
          position: "absolute",
          bottom: 30,
          zIndex: 1,
        }}
      >
        <div
          className="document-measurement"
          style={{ display: "flex", alignItems: "center", columnGap: "8px" }}
        >
          <div
            className="document-measurement-box document-measurement"
            style={{ width: 38, textAlign: "center" }}
          >
            {currentPage}
          </div>{" "}
          / {numberOfPages}
        </div>
        <div>
          <span className="document-separator" />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", columnGap: "8px" }}
        >
          <ZoomOut>
            {(props) => (
              <Button
                type="text"
                className="btn btn-delete-prescription px-0 focus-none h-100"
                onClick={isPdf ? props.onClick : handleImgZoomOut}
              >
                <i className="icon-minus" style={{ color: "white" }} />
              </Button>
            )}
          </ZoomOut>
          <span
            className="mx-2 document-measurement document-measurement-box"
            style={{ minWidth: 70, textAlign: "center" }}
          >
            {Math.round(scale * 100)}%
          </span>
          <ZoomIn>
            {(props) => (
              <Button
                type="text"
                className="btn btn-delete-prescription px-0 focus-none h-100"
                onClick={isPdf ? props.onClick : handleImgZoomIn}
              >
                <i className="icon-Add" style={{ color: "white" }} />
              </Button>
            )}
          </ZoomIn>
        </div>
        <div>
          <span className="document-separator" />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", columnGap: "8px" }}
        >
          <Rotate direction={RotateDirection.Backward}>
            {(props) => (
              <Button
                type="text"
                className="btn btn-delete-prescription px-0 focus-none h-100"
                onClick={isPdf ? props.onClick : rotateLeft}
              >
                <img src={anticlockwise} alt="anticlockwise-direction" />
              </Button>
            )}
          </Rotate>
          <Rotate direction={RotateDirection.Forward}>
            {(props) => (
              <Button
                type="text"
                className="btn btn-delete-prescription px-0 focus-none h-100"
                onClick={isPdf ? props.onClick : rotateRight}
              >
                <img src={clockwise} alt="clockwise-direction" />
              </Button>
            )}
          </Rotate>
        </div>
      </div>
    );
  };

  const ImageControls = () => {
    const { zoomIn, zoomOut, state } = useControls();

    const handleImgZoomIn = (state) => {
      zoomIn();
      setScale(state?.step || 1);
    };

    const handleImgZoomOut = (state) => {
      zoomOut();
      setScale(state?.step || 1);
    };

    return (
      <Controls
        handleImgZoomOut={handleImgZoomOut}
        handleImgZoomIn={handleImgZoomIn}
      />
    );
  };

  return (
    <div>
      <Card bordered={false} className="search-modalCard">
        <div
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
          }}
        >
          <div
            className="h-60 align-items-center justify-content-between d-flex"
            style={{ background: "#222222" }}
          >
            <div className="align-items-center d-flex">
              <Button
                type="text"
                className="btn btn-delete-prescription px-3 focus-none h-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(e);
                }}
              >
                <i className="icon-right text-white" />
              </Button>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  className="text-white"
                  style={{ fontSize: 16, fontWeight: 500 }}
                >
                  {categoryName}
                </span>
              </div>
            </div>
            <div
              className="align-items-center d-flex gap-4"
              style={{ padding: "20px" }}
            >
              <i
                className="icon-download"
                style={{ cursor: "pointer", color: "white" }}
                onClick={(e) =>
                  !isChrome && !isSafari
                    ? handleInAppDownload(e)
                    : handleDownload(e)
                }
              />

              <i
                className="icon-delete"
                style={{ cursor: "pointer", color: "white" }}
                onClick={(e) => toggleDeletePopup(e)}
              />
              <i
                className="icon-Edit"
                style={{ cursor: "pointer", color: "white" }}
                onClick={(e) => handleEdit(e)}
              />
              <Button
                className="btn btn-primary3 btn-text-white px-4 btn-41"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(e);
                }}
              >
                {"close"}
              </Button>
            </div>
          </div>
          <div
            className="align-items-start justify-content-between d-flex flex-column"
            style={{
              background: "#222222",
              padding: "0 0 25px 55px",
              rowGap: 10,
              marginTop: -15,
            }}
          >
            <span className="document-date">
              {dayjs(cardData?.investigation_date).format("DD MMM, YYYY")}
            </span>
            {cardData?.notes ? (
              <div className="document-notes">
                <b>Notes</b> : {cardData?.notes}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="d-flex flex-column justify-content-center align-items-center">
        {isPdf ? <Controls /> : null}

        <div
          className="pdf-container"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          {cardData?.url?.includes(".pdf") ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={cardData?.url}
                plugins={[
                  zoomPluginInstance,
                  rotatePluginInstance,
                  pageNavigationPluginInstance,
                ]}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onDocumentLoad={onLoadSuccess}
                onPageChange={onPageChange}
                onZoom={handleOnZoom}
                defaultScale={scale}
              />
            </Worker>
          ) : (
            <TransformWrapper initialScale={1}>
              {({ zoomIn, zoomOut, ...rest }) => (
                <>
                  <ImageControls />
                  <TransformComponent>
                    <img
                      ref={imgRef}
                      src={cardData?.url}
                      alt="image-url"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transition: "transform 0.5s",
                        borderRadius: "12px",
                      }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
