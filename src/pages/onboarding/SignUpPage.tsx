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
import { validatePhoneNumber } from "./phoneNumber";

export function SignUpPage() {
  const navigate = useNavigate();
  const signup = useSignUp();
  const [phoneError, setPhoneError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signup.isPending) return;

    const values = new FormData(event.currentTarget);
    const phoneNumber = String(values.get("phone") ?? "");
    const password = String(values.get("password") ?? "");
    const nextPhoneError = validatePhoneNumber(phoneNumber);
    setPhoneError(nextPhoneError);
    if (nextPhoneError) return;

    signup.mutate(
      { phoneNumber, password },
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
          disabled={signup.isPending}
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
          inputMode="numeric"
          maxLength={11}
          name="phone"
          label="휴대폰 번호"
          autoComplete="username"
          placeholder="휴대폰 번호를 입력해 주세요."
          readOnly={signup.isPending}
          error={phoneError}
          onChange={() => {
            setPhoneError("");
            signup.reset();
          }}
          className="rounded-sm border-border-grey text-label-l"
        />
        <PasswordField
          name="password"
          label="비밀번호"
          autoComplete="new-password"
          placeholder="비밀번호를 입력해 주세요."
          readOnly={signup.isPending}
          onChange={() => signup.reset()}
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
