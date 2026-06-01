import './Alert.css';

export default function Alert({ variant = 'info', children, onClose }) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      <span className="alert__message">{children}</span>
      {onClose && (
        <button type="button" className="alert__close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}
