import './Spinner.css';

export default function Spinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className={`spinner-wrap spinner-wrap--${size}`} role="status">
      <div className="spinner" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}
