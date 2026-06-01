import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Inbox size={24} strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="empty-state__btn">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
