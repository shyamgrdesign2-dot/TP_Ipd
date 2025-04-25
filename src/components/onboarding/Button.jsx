import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  disabled = false 
}) {
  return (
    <button
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}