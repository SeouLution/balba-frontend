import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { ApiError } from "@/api/client";
import { LogoMark } from "@/components/icons";
import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";
import { useLogIn } from "@/hooks/useAuth";

import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingLink,
  OnboardingScreen,
} from "./OnboardingScreen";
import { validatePhoneNumber } from "./phoneNumber";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogIn();
  const [phoneError, setPhoneError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (login.isPending) return;

    const values = new FormData(event.currentTarget);
    const phoneNumber = String(values.get("phone") ?? "");
    const password = String(values.get("password") ?? "");
    const nextPhoneError = validatePhoneNumber(phoneNumber);
    setPhoneError(nextPhoneError);
    if (nextPhoneError) return;

    login.mutate(
      { phoneNumber, password },
      {
        onSuccess: ({ storeId }) => navigate(storeId ? "/home" : "/onboarding", { replace: true }),
      },
    );
  }

  return (
    <OnboardingScreen
      wideCard
      header={
        <header className="flex min-h-18 items-center gap-2 px-5 text-wordmark min-[1025px]:hidden md:px-10">
          <LogoMark size={32} className="text-button-primary" aria-hidden />
          발주바주
        </header>
      }
      footer={
        <OnboardingButton form="login" type="submit" disabled={login.isPending}>
          {login.isPending ? "로그인 중…" : "로그인"}
        </OnboardingButton>
      }
    >
      <OnboardingHeading
        title={
          <>
            좋은 아침입니다.
            <br />
            휴대폰 번호와 비밀번호를 입력해 주세요
          </>
        }
      />
      <form id="login" onSubmit={submit} noValidate aria-busy={login.isPending}>
        <div className="grid gap-6">
          <TextField
            type="tel"
            inputMode="numeric"
            maxLength={11}
            name="phone"
            label="휴대폰 번호"
            autoComplete="username"
            placeholder="휴대폰 번호를 입력해 주세요."
            readOnly={login.isPending}
            error={phoneError}
            onChange={() => {
              setPhoneError("");
              login.reset();
            }}
            className="rounded-sm border-border-grey text-label-l"
          />
          <PasswordField
            name="password"
            label="비밀번호"
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요."
            readOnly={login.isPending}
            onChange={() => login.reset()}
            className="rounded-sm border-border-grey text-label-l"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <OnboardingLink
            to="/signup"
            className="inline-flex min-h-11 items-center rounded-sm text-label-s text-text-gray underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
          >
            회원가입하기
          </OnboardingLink>
        </div>
        {login.isError && (
          <OnboardingError>
            {login.error instanceof ApiError && login.error.code === "UNAUTHORIZED"
              ? "휴대폰 번호 또는 비밀번호가 올바르지 않아요."
              : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요."}
          </OnboardingError>
        )}
      </form>
    </OnboardingScreen>
  );
}
