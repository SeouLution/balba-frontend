import { useNavigate } from "react-router";

import { Check } from "@/components/icons";
import { cn } from "@/utils/cn";

import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { formatSalesPeriod } from "./salesColumns";

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { store, salesImport, salesConfirmed, ingredientIds, receiptPhotoCount } = useOnboarding();
  const menuCount = salesImport.data?.detection?.menuCount;
  const salesSummary = [
    formatSalesPeriod(salesImport.data?.period),
    menuCount == null ? undefined : `메뉴 ${menuCount.toLocaleString("ko-KR")}개`,
  ].filter(Boolean);
  const summary = [
    ...(store?.name ? [{ label: "가게", value: store.name, pending: false }] : []),
    {
      label: "판매 기록",
      value: salesConfirmed ? salesSummary.join(" · ") || "반영 완료" : "나중에 올릴게요",
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
          ? "판매 기록을 가게에 반영했어요."
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
