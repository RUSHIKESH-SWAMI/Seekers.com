import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import './ActionCard.css';

/**
 * Dashboard quick-action card with icon, title, and CTA.
 */
export default function ActionCard({
  icon: Icon,
  title,
  subtitle,
  to,
  buttonLabel,
  variant = 'primary',
  accent = 'indigo',
}) {
  return (
    <Card interactive className={`action-card action-card--${accent}`}>
      <div className="action-card__icon-wrap">
        {Icon && <Icon size={22} strokeWidth={2} aria-hidden />}
      </div>
      <h3 className="action-card__title">{title}</h3>
      <p className="action-card__subtitle">{subtitle}</p>
      <Link to={to} className="action-card__link">
        <Button variant={variant} size="sm">
          {buttonLabel}
        </Button>
      </Link>
    </Card>
  );
}
