export function normalizePhoneNumber(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function isMobileNumber(value: string) {
  return /^01\d{8,9}$/.test(value);
}
