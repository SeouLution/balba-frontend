import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { ApiError } from "@/api/client";
import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";
import { useSignUp } from "@/hooks/useAuth";

import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingLink,
  OnboardingScreen,
} from "./OnboardingScreen";
import { isMobileNumber, normalizePhoneNumber } from "./phoneNumber";

export function SignUpPage() {
  const navigate = useNavigate();
  const signup = useSignUp();
  const [values, setValues] = useState({ phone: "", password: "", confirmation: "" });
  const [submitted, setSubmitted] = useState(false);
  const phoneNumber = normalizePhoneNumber(values.phone);
  const ready = Boolean(phoneNumber && values.password && values.confirmation);
  const phoneError = isMobileNumber(phoneNumber)
    ? undefined
    : "01로 시작하는 휴대폰 번호 10~11자리를 입력해 주세요.";
  const passwordLength = Array.from(values.password).length;
  const passwordError =
    passwordLength >= 8 && passwordLength <= 128
      ? undefined
      : "비밀번호를 8~128자로 입력해 주세요.";
  const confirmationError =
    values.password !== values.confirmation ? "비밀번호가 일치하지 않아요." : undefined;

  function change(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    signup.reset();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || signup.isPending) return;

    setSubmitted(true);
    if (phoneError || passwordError || confirmationError) return;

    signup.mutate(
      { phoneNumber, password: values.password },
      { onSuccess: () => navigate("/onboarding", { replace: true }) },
    );
  }

  return (
    <OnboardingScreen
      wideCard
      footer={
        <OnboardingButton
          className="disabled:text-text-gray-darker"
          form="sign-up"
          type="submit"
          disabled={!ready || signup.isPending}
        >
          {signup.isPending ? "가입 중…" : "가입하기"}
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
      <form
        id="sign-up"
        onSubmit={submit}
        noValidate
        aria-busy={signup.isPending}
        className="mt-1 grid gap-6"
      >
        <TextField
          type="tel"
          name="phone"
          label="휴대폰 번호"
          autoComplete="username"
          placeholder="휴대폰 번호를 입력해 주세요."
          aria-required="true"
          readOnly={signup.isPending}
          value={values.phone}
          onChange={(event) => change("phone", event.target.value)}
          error={submitted ? phoneError : undefined}
          className="rounded-sm border-border-grey text-label-l"
        />
        <PasswordField
          name="password"
          label="비밀번호"
          autoComplete="new-password"
          placeholder="비밀번호를 입력해 주세요."
          aria-required="true"
          readOnly={signup.isPending}
          value={values.password}
          onChange={(event) => change("password", event.target.value)}
          error={submitted ? passwordError : undefined}
          className="rounded-sm border-border-grey text-label-l"
        />
        <PasswordField
          name="confirmation"
          label="비밀번호 확인"
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해 주세요."
          aria-required="true"
          readOnly={signup.isPending}
          value={values.confirmation}
          onChange={(event) => change("confirmation", event.target.value)}
          error={submitted ? confirmationError : undefined}
          className="rounded-sm border-border-grey text-label-l"
        />
        <div>
          {signup.isError && (
            <OnboardingError>
              {signup.error instanceof ApiError && signup.error.code === "CONFLICT"
                ? "이미 가입한 휴대폰 번호예요. 로그인해 주세요."
                : "가입하지 못했어요. 잠시 후 다시 시도해 주세요."}
            </OnboardingError>
          )}
          <OnboardingLink to="/" className="inline-block text-caption text-button-primary">
            로그인으로 돌아가기
          </OnboardingLink>
        </div>
      </form>
    </OnboardingScreen>
  );
}
