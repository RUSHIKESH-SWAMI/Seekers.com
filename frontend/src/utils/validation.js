/** Client-side form validation helpers */

export function validateRequired(fields) {
  const errors = {};
  Object.entries(fields).forEach(([key, value]) => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    if (trimmed === '' || trimmed === null || trimmed === undefined) {
      errors[key] = `${labelFor(key)} is required`;
    }
  });
  return errors;
}

function labelFor(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());
}

export function validateRegister({ username, email, password, password_confirm, role }) {
  const errors = validateRequired({ username, email, password, password_confirm, role });
  if (password && password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (password && password_confirm && password !== password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRe.test(email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

export function validateLogin({ username, password }) {
  return validateRequired({ username, password });
}

export function validateJob({ title, description, skills_required, location }) {
  return validateRequired({ title, description, skills_required, location });
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
