import './Logo.css';

export default function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <span className="logo__mark" aria-hidden>
        S
      </span>
      <span className="logo__text">Seekers</span>
    </span>
  );
}
