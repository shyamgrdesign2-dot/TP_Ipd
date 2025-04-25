import './FormSelect.css';

export default function FormSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  required = false 
}) {
  return (
    <div className="form-select">
      <label className="select-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <div className="select-wrapper">
        <select
          className="select-field"
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow"></div>
      </div>
    </div>
  );
}