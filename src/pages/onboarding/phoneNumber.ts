export function validatePhoneNumber(value: string) {
  // 서버 규칙(01로 시작 10~11자리)대로 받되, 안내는 흔한 010 번호 기준으로 짧게 한다.
  return /^01[0-9]{8,9}$/.test(value) ? "" : "010으로 시작하는 11자리로 입력해 주세요.";
}
