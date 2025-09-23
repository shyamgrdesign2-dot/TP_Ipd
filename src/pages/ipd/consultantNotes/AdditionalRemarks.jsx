import React from "react";
import { useState } from "react";
import { IPD } from "../../../utils/locale";

const AdditionalRemarks = ({
  onExitModal,
  onStoreData,
  initialData,
  setDataToSend,
  dataToSend,
}) => {
  const [formData, setFormData] = useState({
    additionalRemarks: initialData?.additionalRemarks || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setDataToSend((prev) => ({
      ...prev,
      additionalRemarks: formData.additionalRemarks,
    }));
    onStoreData({ additionalRemarks: formData.additionalRemarks });
  };

  return (
    <div>
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          {IPD.additionalRemarks}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={onExitModal}
        ></button>
      </div>
      <div className="modal-body">
        <div className="form-group mb-3">
          <label htmlFor="additionalRemarks" className="form-label">
            {IPD.additionalRemarks}
          </label>
          <textarea
            id="additionalRemarks"
            name="additionalRemarks"
            className="form-control"
            rows="4"
            value={formData.additionalRemarks}
            onChange={handleChange}
            placeholder={`Enter ${IPD?.additionalRemarks?.toLowerCase()}...`}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onExitModal}
        >
          {IPD.cancel}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          {IPD.save}
        </button>
      </div>
    </div>
  );
};

export default AdditionalRemarks;
