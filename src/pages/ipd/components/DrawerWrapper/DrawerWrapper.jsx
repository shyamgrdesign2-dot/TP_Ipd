import React from "react";
import "./styles.scss";
import { Button, Card, Drawer } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";

const DrawerWrapper = ({
  children,
  open,
  onClose,
  width = "100%",
  onSave,
  title,
  saveButtonText = "Save",
  sectionFrom = "Admission Assessment Form",
}) => {
  return (
    <Drawer
      placement="right"
      closeIcon={false}
      onClose={onClose}
      width={width}
      open={open}
      rootClassName={"drawer-wrapper-container"}
      className={`modalWidth-${width}`}
    >
      <>
        <Card bordered={false} className="search-modalCard">
          <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
            <div className="align-items-center d-flex h-100">
              <div className="border-end h-100 text-center me-3">
                <div
                  onClick={onClose}
                  className="btn-headerback align-items-center d-flex h-100 justify-content-around cursor-pointer"
                >
                  <i className="icon-right"></i>
                </div>
              </div>
              <div className="title-common">{`Add ${title}`}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                className="btn btn-primary3 btn-41 px-4 me-20"
                onClick={onSave}
              >
                {saveButtonText}
              </Button>
            </div>
          </div>
          <div className="modalcard-body drawer-wrapper-body">
            <div className="disclaimer-banner">
              <img
                src={defaultIcons.infoIconWarningColoured}
                alt="warning"
                className="banner-icon"
              />
              <p className="banner-text">
                <strong>Disclaimer:</strong> This{" "}
                <strong>{title}</strong> section in the{" "}
                <strong>Discharge Summary</strong> is{" "}
                <strong>directly linked</strong> with the{" "}
                <strong>{sectionFrom}</strong>. If you{" "}
                <strong>add or edit</strong> details here, the same changes will
                be <strong>automatically updated there!</strong>
              </p>
                <img className="banner-icon"  src={defaultIcons.crossIcon} alt="close" />
            </div>
            {children}
          </div>
        </Card>
      </>
    </Drawer>
  );
};

export default DrawerWrapper;
