import { Button, Card, Spin } from "antd";
import {
  Worker,
  Viewer,
  RotateDirection,
  ProgressBar,
} from "@react-pdf-viewer/core";
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
import { isBrowser } from "react-device-detect";
import dayjs from "dayjs";
import config from "../../../../config";
import { PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN } from "../../../../utils/constants";

const DocumentPreview = ({
  onClose,
  cardData,
  handleEdit,
  toggleDeletePopup,
  handleInAppDownload,
  handleDownload,
  isEditable = true
}) => {
  const { uploadDocCategories } = useSelector((state) => state.uploadDoc);
  const categoryName =
    cardData?.category_id === -2
      ? "Zydus"
      : uploadDocCategories.find(
          (item) => item.category_id === cardData?.category_id
        )?.category_name;
  const [scale, setScale] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const zoomPluginInstance = zoomPlugin();
  const rotatePluginInstance = rotatePlugin();
  const { Rotate } = rotatePluginInstance;
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const [isPdf, setIsPdf] = useState(true);
  const imgRef = useRef(null);
  const [angle, setAngle] = useState(0);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  useEffect(() => {
    // Initial timeout
    resetControlsTimeout();

    // Cleanup on unmount
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      cardData?.url?.startsWith(config.zydus_proxy_url) ||
      cardData?.url?.includes(".pdf")
    ) {
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
    const { zoomIn, zoomOut } = useControls();

    const handleImgZoomIn = () => {
      zoomIn();
      setScale((prevScale) => prevScale + 0.2);
    };

    const handleImgZoomOut = () => {
      zoomOut();
      setScale((prevScale) => (prevScale - 0.2 > 1 ? prevScale - 0.2 : 1));
    };

    return (
      <Controls
        handleImgZoomOut={handleImgZoomOut}
        handleImgZoomIn={handleImgZoomIn}
      />
    );
  };

  return (
    <div onMouseMove={resetControlsTimeout}>
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
                onClick={onClose}
              >
                <i className="icon-right text-white" />
              </Button>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span
                  className="text-white"
                  style={{ fontSize: 16, fontWeight: 500 }}
                >
                  {categoryName}
                </span>
                <span className="document-separator" />
                <span className="document-date">
                  {dayjs(cardData?.investigation_date).format("DD MMM, YYYY")}
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
                onClick={() =>
                  !isBrowser ? handleInAppDownload() : handleDownload()
                }
              />

              {isEditable && (
                <>
                  <i
                    className="icon-delete"
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={toggleDeletePopup}
                  />
                  <i
                    className="icon-Edit"
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleEdit}
                  />
                </>
              )}

              <Button
                className="btn btn-primary3 btn-text-white px-4 btn-41"
                onClick={onClose}
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
            {cardData?.notes ? (
              <div className="document-notes">
                <b>Notes</b> : {cardData?.notes}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="d-flex flex-column justify-content-center align-items-center">
        {isPdf && showControls ? <Controls /> : null}

        <div
          className="pdf-container"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          {isPdf ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
            >
              <Viewer
                renderLoader={(percentages) => (
                  <Spin
                    style={{
                      position: "absolute",
                      zIndex: 0,
                      left: "50%",
                      top: "50%",
                    }}
                  />
                )}
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
                httpHeaders={
                  cardData?.url?.startsWith(config.zydus_proxy_url) && {
                    Authorization: `Bearer ${
                      localStorage.getItem(
                        PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN
                      ) == null
                        ? null
                        : JSON.parse(
                            localStorage.getItem(
                              PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN
                            )
                          )
                    }`,
                  }
                }
              />
            </Worker>
          ) : (
            <TransformWrapper
              initialScale={1}
              options={{ zoomStep: 0.2 }}
              onTransformed={(e) => {
                // Update scale when transform changes (including pinch zoom)
                setScale(e.state.scale);
              }}
            >
              {({ zoomIn, zoomOut, ...rest }) => (
                <>
                  {showControls && <ImageControls />}
                  <TransformComponent>
                    <div
                      style={{
                        width: "700px",
                        height: "600px",
                        position: "relative",
                        borderRadius: "12px",
                      }}
                    >
                      <img
                        ref={imgRef}
                        src={cardData?.url}
                        alt="image-url"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transform: `rotate(${angle}deg)`,
                          transition: "transform 0.5s",
                        }}
                      />
                    </div>
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
