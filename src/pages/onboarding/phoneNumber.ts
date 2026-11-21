export function isMobileNumber(value: string) {
  return /^010\d{8}$/.test(value.replace(/[\s-]/g, ""));
}
