import './FormField.css';

export default function Textarea({ label, id, error, hint, className = '', rows = 4, ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-field__label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`form-field__input form-field__textarea ${error ? 'form-field__input--error' : ''}`}
        {...props}
      />
      {hint && !error && <span className="form-field__hint">{hint}</span>}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
