import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Check } from "@/components/icons";
import { LoadingSpinner } from "@/components/Loading";

import { OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

const demoWaitMs = 2500;

const steps = [
  { label: "메뉴 이름 읽기", done: true },
  { label: "메뉴별 재료 고르기", done: false },
  { label: "1인분 사용량 계산하기", done: false },
];

export function IngredientLoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/onboarding/ingredients", { replace: true });
    }, demoWaitMs);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <OnboardingScreen step={3} wideCard preparingIngredients onBack={() => navigate(-1)}>
      <OnboardingHeading
        title={
          <>
            발주바주가
            <br />
            재료를 고르고 있어요
          </>
        }
      >
        메뉴 이름을 보고 들어가는 재료와 1인분 사용량을 먼저 추려 드릴게요.
        <br />다 되면 사장님이 틀린 곳만 고치면 돼요.
      </OnboardingHeading>
      <div className="grid gap-7 md:mt-5 md:gap-10">
        <ul className="grid gap-7 md:gap-10" aria-label="재료 정리 진행 상태">
          {steps.map(({ label, done }) => (
            <li
              key={label}
              className="flex items-center gap-5 text-body-l-b break-keep text-button-primary md:text-subtitle md:font-bold"
            >
              {done ? (
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-button-primary text-text-white"
                >
                  <Check size={20} />
                </span>
              ) : (
                <LoadingSpinner className="size-8 shrink-0 border-2 border-border-divider border-t-border-divider border-b-button-primary motion-reduce:animate-none" />
              )}
              {label}
            </li>
          ))}
        </ul>
        <p role="status" className="text-body-m text-text-gray">
          보통 30초 안에 끝나요. 이 화면을 닫아도 분석은 계속돼요.
        </p>
      </div>
    </OnboardingScreen>
  );
}
