import './Card.css';

export default function Card({
  children,
  className = '',
  padding = true,
  interactive = false,
  glass = false,
  ...props
}) {
  const classes = [
    'card',
    padding && 'card--padded',
    interactive && 'card--interactive',
    glass && 'card--glass',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="card-header">
      <div>
        {title && <h3 className="card-header__title">{title}</h3>}
        {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card-header__action">{action}</div>}
    </div>
  );
}
