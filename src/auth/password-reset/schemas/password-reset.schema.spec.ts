
import { PasswordReset, PasswordResetSchema } from './password-reset.schema';

describe('PasswordResetSchema', () => {
  it('should be defined', () => {
    expect(PasswordResetSchema).toBeDefined();
  });

  it('should have a PasswordReset class', () => {
    expect(new PasswordReset()).toBeDefined();
  });
});
