import './Badge.css';
import { capitalize } from '../../utils/format';

const VARIANT_MAP = {
  applied: 'neutral',
  shortlisted: 'success',
  rejected: 'danger',
  booked: 'info',
  completed: 'success',
  cancelled: 'neutral',
};

export default function Badge({ status, children }) {
  const variant = VARIANT_MAP[status] || 'neutral';
  return <span className={`badge badge--${variant}`}>{children || capitalize(status)}</span>;
}
