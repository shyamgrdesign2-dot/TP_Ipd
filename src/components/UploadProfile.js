import React, { useState } from "react";
import defaultprofile from "../assets/images/default-profile.svg";

function UploadProfile({ patientInfo, setPatientInfo }) {
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
      <div>
        <img
          className="profilepic"
          src={file ? file : defaultprofile}
          alt="Profile Photo"
        />
      </div>
      <div className="text-center mt-4">
        <div className="btn btn-input btn-41 d-flex align-items-center">
          <input type="file" accept="image/*" onChange={handleChange} />
          <i className="icon-camera me-3"></i> <span>Upload Profile</span>
        </div>
      </div>
    </>
  );
}

export default React.memo(UploadProfile);
