import UploadBox from './UploadBox';
import './UploadProofStep.css';

export default function UploadProofStep() {
  return (
    <div className="upload-proof-step">
      <UploadBox
        label="Government ID Proof"
        description="Upload Aadhar Card/PAN Card/any available Government ID proofs for verification"
        required
      />
      
      <div className="upload-separator">and</div>
      
      <UploadBox
        label="MRC Certificate"
        description="Upload Medical Registration Certificate for verification"
        required
      />
    </div>
  );
}