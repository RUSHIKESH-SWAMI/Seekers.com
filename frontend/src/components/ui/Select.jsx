import './FormField.css';

export default function Select({ label, id, error, options = [], placeholder, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-field__label">
          {label}
        </label>
      )}
      <select id={inputId} className={`form-field__input form-field__select ${error ? 'form-field__input--error' : ''}`} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
