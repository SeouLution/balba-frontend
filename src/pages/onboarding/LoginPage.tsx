import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { Checkbox } from "@/components/Checkbox";
import { LogoMark } from "@/components/icons";
import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";

import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { isMobileNumber } from "./phoneNumber";

export function LoginPage() {
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const phone = String(values.get("phone") ?? "");
    const password = String(values.get("password") ?? "");
    const nextPhoneError = isMobileNumber(phone)
      ? ""
      : "010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요.";
    const nextPasswordError = password ? "" : "비밀번호를 입력해 주세요.";
    setPhoneError(nextPhoneError);
    setPasswordError(nextPasswordError);
    setNotice(
      nextPhoneError || nextPasswordError
        ? ""
        : "계정 로그인은 준비 중이에요. 시연용 로그인으로 시작할 수 있어요.",
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
        <>
          <OnboardingButton form="login" type="submit">
            로그인
          </OnboardingButton>
          <OnboardingButton secondary onClick={() => navigate("/onboarding")}>
            시연용 로그인
          </OnboardingButton>
        </>
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
      <form id="login" onSubmit={submit} noValidate>
        <div className="grid gap-6">
          <TextField
            type="tel"
            name="phone"
            label="휴대폰 번호"
            autoComplete="username"
            placeholder="휴대폰 번호를 입력해 주세요."
            required
            error={phoneError || undefined}
            onChange={() => {
              setPhoneError("");
              setNotice("");
            }}
            className="rounded-sm border-border-grey text-label-l"
          />
          <PasswordField
            name="password"
            label="비밀번호"
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요."
            required
            error={passwordError || undefined}
            onChange={() => {
              setPasswordError("");
              setNotice("");
            }}
            className="rounded-sm border-border-grey text-label-l"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
          <Checkbox label="로그인 상태 유지" defaultChecked className="gap-3 text-label-s" />
          <Link
            to="/signup"
            className="inline-flex min-h-11 items-center rounded-sm text-label-s text-text-gray underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
          >
            회원가입하기
          </Link>
        </div>
        <p role="status" className="mt-2 text-caption text-text-gray-darker">
          {notice}
        </p>
      </form>
    </OnboardingScreen>
  );
}
