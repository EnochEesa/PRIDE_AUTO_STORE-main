const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const UNSAFE_CHARS = /[<>`{}]/g;
const WHITESPACE = /\s+/g;

const clean = (value: string): string =>
  value
    .replace(CONTROL_CHARS, "")
    .replace(UNSAFE_CHARS, "")
    .replace(WHITESPACE, " ")
    .trim();

const limit = (value: string, maxLength: number): string => clean(value).slice(0, maxLength);

export const sanitizeTextInput = (value: string, maxLength = 120): string =>
  limit(value, maxLength);

export const sanitizeSecret = (value: string, maxLength = 128): string =>
  value.replace(CONTROL_CHARS, "").slice(0, maxLength);

export const sanitizeName = (value: string): string => limit(value, 60);

export const sanitizeEmail = (value: string): string =>
  limit(value.toLowerCase(), 120);

export const sanitizeSearchQuery = (value: string): string =>
  limit(value, 60);

export const sanitizeOrderReference = (value: string): string =>
  limit(value.toUpperCase(), 32);

export const sanitizeContact = (value: string): string => limit(value, 80);

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isAdminEmail = (value: string): boolean => {
  const email = sanitizeEmail(value);
  return (
    email === "admin@prideautostore.com" ||
    email === "admin@prideautostore.in" ||
    email.endsWith("@prideautostore.com")
  );
};
