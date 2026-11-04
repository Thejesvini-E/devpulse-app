export const validateRequired = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) return `Please enter ${label}`;
  return null;
};

export const validateFullName = (value) => {
  const requiredError = validateRequired(value, 'your full name');
  if (requiredError) return requiredError;
  return value.length <= 100 ? null : 'Full name must be no more than 100 characters';
};

export const validateUsername = (value) => {
  const requiredError = validateRequired(value, 'a username');
  if (requiredError) return requiredError;
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (value.length > 20) return 'Username must be no more than 20 characters';
  return null;
};

export const validateEmail = (value) => {
  if (!value) return 'Please enter your email';
  if (value.length > 50) return 'Email must be no more than 50 characters';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address';
};

export const validatePassword = (value) => {
  if (!value) return 'Please enter a password';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 64) return 'Password must be no more than 64 characters';
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) return 'Password must include a letter and a number';
  return null;
};

export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) return 'Please confirm your password';
  return password === confirmation ? null : 'Passwords do not match';
};

export const validateRole = (role) => {
  return role === 'ROLE_DEVELOPER' || role === 'ROLE_MANAGER'
    ? null
    : 'Please choose a valid role';
};
