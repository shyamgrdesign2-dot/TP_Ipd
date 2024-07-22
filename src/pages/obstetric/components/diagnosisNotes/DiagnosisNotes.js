import React, { useCallback, useState, useContext, useEffect } from "react";
import { Button, Card, Input } from "antd";

import alertIcon from "../../../../assets/images/alertIcon.svg";
import CommonModal from "../../../../common/CommonModal";

const DiagnosisNotes = ({
  handleDrawerDiagnosisNotes,
  diagnosisNotes,
  setDiagnosisNotes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState("");

  const showHideModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const onSave = async () => {
    handleDrawerDiagnosisNotes();
  };

  const onChange = useCallback(
    (e) => {
      setDiagnosisNotes(e.target.value);
    },
    [diagnosisNotes]
  );

  const onDeleteClicked = async () => {
    setDiagnosisNotes("");
    handleDrawerDiagnosisNotes();
  };

  return (
    <>
      <Card bordered={false} className="search-modalCard bg-body">
        <div className="modalCard-header h-60 align-items-center justify-content-between d-flex">
          <div className="align-items-center d-flex">
            <Button
              type="text"
              className="btn btn-delete-prescription px-3 focus-none h-100"
              onClick={handleDrawerDiagnosisNotes}
            >
              <i className="icon-Cross fs-3"></i>
            </Button>
            <div className="modal-title">
              {diagnosisNotes ? "Edit " : "Add "}
              diagnosis notes
            </div>
          </div>
          <Button
            onClick={onSave}
            className="btn btn-primary3 btn-41 px-4 me-20"
          >
            Save
          </Button>
        </div>
        <div className="px-20 py-3">
          <Input.TextArea
            placeholder="Enter additional details related to patient diagnosis"
            value={diagnosisNotes}
            onChange={onChange}
            className="textareaPlaceholder"
            rows={4}
          />
          {diagnosisNotes && (
            <button
              onClick={showHideModal}
              className="mt-2 btn d-flex align-items-center btn-text float-end"
            >
              <i className="icon-delete me-2 fs-5"></i> <span>Delete Note</span>
            </button>
          )}
        </div>
      </Card>
      <CommonModal
        isModalOpen={isModalOpen}
        onCancel={showHideModal}
        modalWidth={357}
        title={"Delete Note"}
        modalBody={
          <>
            <div className="alert-warning rounded-10px p-2 patient-details">
              <div className="d-flex align-items-center">
                <img className="me-3" src={alertIcon} alt="Warning" />
                <span>Are you sure you want to delete this note?</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="d-flex align-items-center mt-2 justify-content-end">
                <div
                  onClick={onDeleteClicked}
                  className="me-4 text-decoration-underline btn p-0 text-main"
                >
                  Yes, Delete
                </div>
                <Button
                  onClick={showHideModal}
                  className="lh-lg btn btn-primary3 btn-41 px-4"
                >
                  <span>No, Keep</span>
                </Button>
              </div>
            </div>
          </>
        }
      />
    </>
  );
};

export default DiagnosisNotes;
