import './FormField.css';

/** Text input with label and error display */
export default function Input({
  label,
  id,
  error,
  hint,
  className = '',
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-field__label">
          {label}
        </label>
      )}
      <input id={inputId} className={`form-field__input ${error ? 'form-field__input--error' : ''}`} {...props} />
      {hint && !error && <span className="form-field__hint">{hint}</span>}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
