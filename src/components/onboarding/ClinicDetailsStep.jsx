import FormInput from './FormInput';
import './ClinicDetailsStep.css';
// import { Loader } from '../Icons/Icons';


export default function ClinicDetailsStep({ formData, updateFormData, detectLocation }) {
  return (
    <div className="clinic-details-step">
      <FormInput
        label="Clinic Name"
        placeholder="Enter your Clinic Name"
        value={formData.clinicName}
        onChange={(e) => updateFormData('clinicName', e.target.value)}
        required
      />
      
      <div className="location-field">
        <FormInput
          label="Clinic Pincode"
          placeholder="Enter your Clinic pincode"
          value={formData.clinicPincode}
          onChange={(e) => updateFormData('clinicPincode', e.target.value)}
          required
        />
        
        {formData.location ? (
          <div className="location-display">{formData.location}</div>
        ) : (
          <button
            className="detect-location-button"
            onClick={detectLocation}
            disabled={formData.isDetectingLocation}
          >
            {formData.isDetectingLocation ? (
              <span className="detecting-location">
                {/* <Loader /> */}
                Detecting Location...
              </span>
            ) : (
              "Detect Location"
            )}
          </button>
        )}
      </div>
      
      <FormInput
        label="Clinic Address"
        placeholder="Enter your Clinic Address ( Building, Street etc)"
        value={formData.clinicAddress}
        onChange={(e) => updateFormData('clinicAddress', e.target.value)}
      />
    </div>
  );
}