import React, { useState, useEffect } from "react";
import defaultprofile from "../assets/images/default-profile.svg";
import { Form } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { ADD, EDIT } from "../utils/constants";

function UploadProfile({ form, mode = ADD }) {

  const { patients_details } = useSelector((state) => state.records);

  const [file, setFile] = useState();

  useEffect(() => {
    if (patients_details && mode === EDIT) {
      setFile(patients_details.pm_image_path)
    }
  }, [patients_details]);

  function handleChange(e) {
    if (e.target.files?.length > 0) {
      // console.log(e.target.files[0])
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setFile(fileUrl);
      form.setFieldsValue({
        pm_image: e.target.files[0],
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
          <Form.Item name="pm_image" />
          <input type="file" accept="image/*" onChange={handleChange} />
          <i className="icon-camera me-3" /> <span>{`${file ? 'Update' : 'Upload'} Profile`}</span>
        </div>
      </div>
    </>
  );
}

export default React.memo(UploadProfile);
