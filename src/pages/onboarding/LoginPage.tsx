import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { Checkbox } from "@/components/Checkbox";
import { LogoMark } from "@/components/icons";
import { TextField } from "@/components/TextField";

import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get("phone") ?? "");
    setNotice("");
    if (!/^010\d{8}$/.test(phone.replace(/[\s-]/g, ""))) {
      setError("010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요.");
      return;
    }

    setNotice("문자 인증은 준비 중이에요. 시연용 로그인으로 시작할 수 있어요.");
  }

  return (
    <OnboardingScreen
      header={
        <header className="flex min-h-18 items-center gap-2 px-5 text-wordmark min-[1025px]:hidden md:px-10">
          <LogoMark size={32} className="text-button-primary" aria-hidden />
          발주바주
        </header>
      }
      footer={
        <>
          <OnboardingButton form="login" type="submit">
            인증번호 받기
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
            휴대폰 번호로 로그인해요
          </>
        }
      >
        비밀번호 없이, 문자로 받은 인증번호로 들어와요
      </OnboardingHeading>
      <form id="login" onSubmit={submit} noValidate>
        <TextField
          type="tel"
          name="phone"
          label="휴대폰 번호"
          autoComplete="tel-national"
          placeholder="010-0000-0000"
          required
          error={error || undefined}
          onChange={() => {
            setError("");
            setNotice("");
          }}
          className="rounded-sm border-border-grey"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
          <Checkbox label="로그인 상태 유지" defaultChecked className="gap-3 text-label-s" />
          <button
            type="button"
            onClick={() => {
              setError("");
              setNotice("회원가입은 준비 중이에요. 시연용 로그인으로 둘러볼 수 있어요.");
            }}
            className="min-h-11 rounded-sm text-label-s text-text-gray underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
          >
            회원가입하기
          </button>
        </div>
        <p role="status" className="mt-2 text-caption text-text-gray-darker">
          {notice}
        </p>
      </form>
    </OnboardingScreen>
  );
}
