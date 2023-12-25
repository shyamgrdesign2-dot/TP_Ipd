import React, { useState } from "react";
import defaultprofile from "../assets/images/default-profile.svg";
import { Form } from "antd";

function UploadProfile({
  form,
  onFinish,
  onFinishFailed,
  patientInfo,
  setPatientInfo,
}) {
  const [file, setFile] = useState(null);

  function handleChange(e) {
    console.log(e.target.files);
    if (e.target.files?.length > 0) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setFile(fileUrl);
      setPatientInfo({
        ...patientInfo,
        pm_image: fileUrl,
      });
    }
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="advanced_search"
        className="form_addnewpatient"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div>
          <img
            className="profilepic"
            src={file ? file : defaultprofile}
            alt="Profile Photo"
          />
        </div>
        <div className="text-center mt-4">
          <div className="btn btn-input btn-41 d-flex align-items-center">
            <Form.Item name="pm_image" label="Profile Photo">
              <input type="file" accept="image/*" onChange={handleChange} />
            </Form.Item>
            <i className="icon-camera me-3" /> <span>Upload Profile</span>
          </div>
        </div>
      </Form>
    </>
  );
}

export default React.memo(UploadProfile);
