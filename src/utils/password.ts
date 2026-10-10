export const PASSWORD_MIN_LENGTH = 8;

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return 'Use at least 8 characters.';
  if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter.';
  if (!/\d/.test(password)) return 'Add at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Add at least one special character.';
  return null;
}

export function getPasswordResetRedirectUrl(): string {
  return `${window.location.origin}/?password-recovery=1`;
}
