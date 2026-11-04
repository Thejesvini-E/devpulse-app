import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
  validateRequired,
  validateRole,
  validateUsername,
} from './registrationValidation';

describe('registration validation', () => {
  it('rejects empty required values and accepts nonblank values', () => {
    expect(validateRequired('   ', 'a username')).toBe('Please enter a username');
    expect(validateRequired('amy', 'a username')).toBeNull();
  });

  it('checks email format', () => {
    expect(validateEmail('bad-email')).toBe('Please enter a valid email address');
    expect(validateEmail('amy@example.com')).toBeNull();
  });

  it('enforces backend username and full-name length limits', () => {
    expect(validateUsername('ab')).toBe('Username must be at least 3 characters');
    expect(validateUsername('a'.repeat(21))).toBe('Username must be no more than 20 characters');
    expect(validateUsername('amy')).toBeNull();
    expect(validateFullName('a'.repeat(101))).toBe('Full name must be no more than 100 characters');
    expect(validateEmail('a'.repeat(45) + '@test.com')).toBe('Email must be no more than 50 characters');
  });

  it('rejects short or weak passwords and accepts a strong password', () => {
    expect(validatePassword('abc')).toBe('Password must be at least 8 characters');
    expect(validatePassword('passwordonly')).toBe('Password must include a letter and a number');
    expect(validatePassword('StrongPass123')).toBeNull();
  });

  it('requires matching password confirmation', () => {
    expect(validatePasswordConfirmation('StrongPass123', '')).toBe('Please confirm your password');
    expect(validatePasswordConfirmation('StrongPass123', 'Different123')).toBe('Passwords do not match');
    expect(validatePasswordConfirmation('StrongPass123', 'StrongPass123')).toBeNull();
  });

  it('allows only developer or manager roles at registration', () => {
    expect(validateRole(undefined)).toBe('Please choose a valid role');
    expect(validateRole('ROLE_ADMIN')).toBe('Please choose a valid role');
    expect(validateRole('ROLE_DEVELOPER')).toBeNull();
    expect(validateRole('ROLE_MANAGER')).toBeNull();
  });
});
