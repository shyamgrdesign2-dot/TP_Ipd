import React from "react";
import { useState } from "react";
import { IPD } from "../../../utils/locale";

const Vitals = ({
  onExitModal,
  onStoreData,
  initialData,
  setDataToSend,
  dataToSend,
}) => {
  const [formData, setFormData] = useState({
    temp: initialData?.temp || "",
    pulse: initialData?.pulse || "",
    bp: initialData?.bp || "",
    rr: initialData?.rr || "",
    spo2: initialData?.spo2 || "",
    weight: initialData?.weight || "",
    height: initialData?.height || "",
    bmi: initialData?.bmi || "",
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
      ...formData,
    }));
    onStoreData(formData);
  };

  return (
    <div>
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          {IPD.vitals}
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="temp" className="form-label">
              Temperature (°F)
            </label>
            <input
              type="text"
              id="temp"
              name="temp"
              className="form-control"
              value={formData.temp}
              onChange={handleChange}
              placeholder="Enter temperature"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="pulse" className="form-label">
              Pulse (bpm)
            </label>
            <input
              type="text"
              id="pulse"
              name="pulse"
              className="form-control"
              value={formData.pulse}
              onChange={handleChange}
              placeholder="Enter pulse"
            />
          </div>
        </div>
        {/* Add more vital sign fields as needed */}
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

export default Vitals;
