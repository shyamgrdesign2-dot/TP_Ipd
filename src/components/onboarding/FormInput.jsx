import './FormInput.css';

export default function FormInput({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  type = 'text'
}) {
  return (
    <div className="form-input">
      <label className="input-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}