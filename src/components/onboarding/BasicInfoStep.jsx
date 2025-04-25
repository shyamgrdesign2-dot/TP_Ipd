import FormInput from './FormInput';
import FormSelect from './FormSelect';
import './BasicInfoStep.css';

export default function BasicInfoStep({ formData, updateFormData }) {
  const specialityOptions = [
    { value: 'Dermatologist', label: 'Dermatologist' },
    { value: 'Cardiologist', label: 'Cardiologist' },
    { value: 'Neurologist', label: 'Neurologist' },
    { value: 'Pediatrician', label: 'Pediatrician' }
  ];

  return (
    <div className="basic-info-step">
      <FormInput
        label="Your Full name ( First & Last name)"
        placeholder="Enter your Full name"
        value={formData.fullName}
        onChange={(e) => updateFormData('fullName', e.target.value)}
        required
      />
      
      <FormSelect
        label="Speciality"
        options={specialityOptions}
        value={formData.speciality}
        onChange={(e) => updateFormData('speciality', e.target.value)}
        required
      />
    </div>
  );
}