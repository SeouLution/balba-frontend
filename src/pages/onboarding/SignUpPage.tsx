import { useState, type FormEvent } from "react";

import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";

import {
  OnboardingButton,
  OnboardingHeading,
  OnboardingLink,
  OnboardingScreen,
} from "./OnboardingScreen";
import { isMobileNumber } from "./phoneNumber";

export function SignUpPage() {
  const [values, setValues] = useState({ phone: "", password: "", confirmation: "" });
  const [submitted, setSubmitted] = useState(false);
  const ready = Boolean(values.phone.trim() && values.password && values.confirmation);
  const phoneError =
    submitted && !isMobileNumber(values.phone)
      ? "010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요."
      : undefined;
  const confirmationError =
    submitted && values.password !== values.confirmation
      ? "비밀번호가 일치하지 않아요."
      : undefined;
  const validated = submitted && !phoneError && !confirmationError;

  function change(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready) setSubmitted(true);
  }

  return (
    <OnboardingScreen
      wideCard
      footer={
        <OnboardingButton
          className="disabled:text-text-gray-darker"
          form="sign-up"
          type="submit"
          disabled={!ready}
        >
          가입하기
        </OnboardingButton>
      }
    >
      <OnboardingHeading
        title={
          <>
            회원가입
            <br />
            휴대폰 번호로 시작해요.
          </>
        }
      />
      <form id="sign-up" onSubmit={submit} noValidate className="mt-1 grid gap-6">
        <TextField
          type="tel"
          name="phone"
          label="휴대폰 번호"
          autoComplete="username"
          placeholder="휴대폰 번호를 입력해 주세요."
          aria-required="true"
          value={values.phone}
          onChange={(event) => change("phone", event.target.value)}
          error={phoneError}
          className="rounded-sm border-border-grey text-label-l"
        />
        <PasswordField
          name="password"
          label="비밀번호"
          autoComplete="new-password"
          placeholder="비밀번호를 입력해 주세요."
          aria-required="true"
          value={values.password}
          onChange={(event) => change("password", event.target.value)}
          className="rounded-sm border-border-grey text-label-l"
        />
        <PasswordField
          name="confirmation"
          label="비밀번호 확인"
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해 주세요."
          aria-required="true"
          value={values.confirmation}
          onChange={(event) => change("confirmation", event.target.value)}
          error={confirmationError}
          className="rounded-sm border-border-grey text-label-l"
        />
        <div aria-live="polite" className="text-caption text-text-gray-darker">
          {validated && (
            <>
              <p>입력 내용을 확인했어요. 계정 생성은 준비 중이에요.</p>
              <OnboardingLink to="/" className="mt-2 inline-block text-caption text-button-primary">
                로그인으로 돌아가기
              </OnboardingLink>
            </>
          )}
        </div>
      </form>
    </OnboardingScreen>
  );
}
