import React, { useState } from "react";
import defaultprofile from "../assets/images/default-profile.svg";
import { Form } from "antd";

function UploadProfile({ form }) {
  const [file, setFile] = useState(null);

  function handleChange(e) {
    console.log(e.target.files);
    if (e.target.files?.length > 0) {
      // console.log(e.target.files[0])
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      console.log(fileUrl)
      setFile(fileUrl);
      form.setFieldsValue({
        pm_image: fileUrl,
      });
    }
  }

  return (
    <>
      <div>
        <img
          className="profilepic"
          src={file ? file : defaultprofile}
          alt="Profile Photo"
        />
      </div>
      <div className="text-center mt-4">
        <div className="btn btn-input btn-41 d-flex align-items-center justify-content-center">
          <Form.Item name="pm_image"/>
          <input type="file" accept="image/*" onChange={handleChange} />
          <i className="icon-camera me-3" /> <span>Update Profile</span>
        </div>
      </div>
    </>
  );
}

export default React.memo(UploadProfile);
