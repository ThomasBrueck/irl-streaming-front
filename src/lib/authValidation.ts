export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  email: string;
  username: string;
  displayName: string;
  password: string;
  passwordConfirm: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateLogin(v: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  if (!isValidEmail(v.email)) errors.email = "Enter a valid email address.";
  if (!v.password) errors.password = "Enter your password.";
  return errors;
}

export function validateRegister(v: RegisterValues): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {};
  if (!isValidEmail(v.email)) errors.email = "Enter a valid email address.";
  if (v.username.trim().length < 3) errors.username = "Choose a username with at least 3 characters.";
  if (v.password.length < 6) errors.password = "Use at least 6 characters.";
  if (v.password !== v.passwordConfirm) errors.passwordConfirm = "The passwords don't match.";
  return errors;
}
