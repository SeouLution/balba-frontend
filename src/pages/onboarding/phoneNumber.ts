export function validatePhoneNumber(value: string) {
  return /^01[0-9]{8,9}$/.test(value)
    ? ""
    : "01로 시작하는 휴대폰 번호를 숫자 10~11자리로 입력해 주세요.";
}
