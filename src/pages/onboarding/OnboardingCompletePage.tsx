import { useNavigate } from "react-router";

import { Check } from "@/components/icons";
import { cn } from "@/utils/cn";

import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { exampleSales } from "./salesColumns";

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { draft, salesConfirmed, ingredientIds, receiptPhotoCount } = useOnboarding();
  const summary = [
    { label: "가게", value: draft.name.trim(), pending: false },
    {
      label: "판매 기록",
      value: salesConfirmed
        ? `${exampleSales.period} · 메뉴 ${exampleSales.menuCount}`
        : "나중에 올릴게요",
      pending: !salesConfirmed,
    },
    {
      label: "핵심 재료",
      value: ingredientIds ? `${ingredientIds.length}개` : "나중에 고를게요",
      pending: !ingredientIds,
    },
    {
      label: "거래처 영수증",
      value: receiptPhotoCount > 0 ? `${receiptPhotoCount}장 선택` : "나중에 할게요.",
      pending: receiptPhotoCount === 0,
    },
  ];

  return (
    <OnboardingScreen
      completed
      receiptAttached={receiptPhotoCount > 0}
      wideCard
      scrollBody
      footer={
        <>
          <OnboardingButton onClick={() => navigate("/home")}>홈으로 가기</OnboardingButton>
          <OnboardingButton
            secondary
            onClick={() => navigate("../receipt", { state: { fromCompletion: true } })}
          >
            거래처 영수증 지금 찍기
          </OnboardingButton>
        </>
      }
    >
      <div className="mb-4 grid size-16 shrink-0 place-items-center rounded-full bg-button-primary text-ai-spark">
        <Check size={32} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      </div>
      <OnboardingHeading className="mb-4" title="준비가 끝났어요!">
        {salesConfirmed
          ? "발주바주가 판매 기록을 보고 재료별 발주량을 계산하기 시작했어요."
          : "가게 정보를 입력했어요. 판매 기록은 나중에 올리기로 했어요."}
      </OnboardingHeading>
      <dl className="divide-y divide-border-grey rounded-lg border border-button-subtle px-4.5 py-2">
        {summary.map(({ label, value, pending }) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="shrink-0 text-body-s text-text-gray-darker">{label}</dt>
            <dd
              className={cn(
                "text-right wrap-anywhere",
                pending
                  ? "text-body-s text-text-gray-darker"
                  : "text-label-s-b font-semibold text-text-black",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </OnboardingScreen>
  );
}
