import { useNavigate } from "react-router";

import { Check } from "@/components/icons";

import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { exampleSales } from "./salesColumns";

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { draft, salesConfirmed, ingredientIds } = useOnboarding();
  const salesText = salesConfirmed
    ? `${exampleSales.period} · 메뉴 ${exampleSales.menuCount}`
    : "나중에 올릴게요";
  const summary = [
    ["가게", draft.name.trim()],
    ["판매 기록", salesText],
    [
      "핵심 재료",
      salesConfirmed && ingredientIds ? `${ingredientIds.length}개` : "나중에 고를게요",
    ],
    ["거래처 영수증", "나중에 할게요."],
  ];

  return (
    <OnboardingScreen
      completed
      footer={
        <>
          <OnboardingButton onClick={() => navigate("/home")}>홈으로 가기</OnboardingButton>
          {salesConfirmed && ingredientIds && (
            <OnboardingButton secondary onClick={() => navigate("../recipes")}>
              레시피 다시 보기
            </OnboardingButton>
          )}
        </>
      }
    >
      <div className="mb-5 grid size-13 place-items-center rounded-full bg-button-primary text-text-white">
        <Check size={32} aria-hidden />
      </div>
      <OnboardingHeading title="준비가 끝났어요!">
        {salesConfirmed
          ? "입력한 가게 정보와 온보딩 예시를 확인했어요."
          : "가게 정보를 입력했어요. 판매 기록은 나중에 올리기로 했어요."}
      </OnboardingHeading>
      <dl className="divide-y divide-border-divider rounded-md border border-border-grey px-4">
        {summary.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-13 items-center justify-between gap-4 py-2 text-label-s"
          >
            <dt className="shrink-0 text-text-gray-darker">{label}</dt>
            <dd className="text-right wrap-anywhere">{value}</dd>
          </div>
        ))}
      </dl>
    </OnboardingScreen>
  );
}
