import './UploadBox.css';
// import { Upload } from '../Icons/Icons';

export default function UploadBox({ label, description, required = false }) {
  return (
    <div className="upload-box-container">
      <label className="upload-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <div className="upload-box">
        {/* <Upload /> */}
        <button className="upload-button">Click to Upload</button>
        <p className="upload-description">{description}</p>
      </div>
    </div>
  );
}