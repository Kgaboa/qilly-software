import { describe, expect, it } from 'vitest';
import { validatePassword } from './password';

describe('validatePassword', () => {
  it('accepts a password meeting the Qilly policy', () => {
    expect(validatePassword('Qilly@2026')).toBeNull();
  });

  it.each([
    ['Short1!', 'Use at least 8 characters.'],
    ['QILLY@2026', 'Add at least one lowercase letter.'],
    ['qilly@2026', 'Add at least one uppercase letter.'],
    ['Qilly@Test', 'Add at least one number.'],
    ['Qilly2026', 'Add at least one special character.'],
  ])('rejects %s', (password, message) => {
    expect(validatePassword(password)).toBe(message);
  });
});
