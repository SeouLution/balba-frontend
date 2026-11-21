import { useNavigate } from "react-router";

import { Check } from "@/components/icons";
import { useIngredients } from "@/hooks/useIngredients";
import { cn } from "@/utils/cn";

import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";
import { formatSalesPeriod } from "./salesColumns";

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { store, salesUpload, salesImport, salesConfirmed, receiptPhotoCount } = useOnboarding();
  const ingredients = useIngredients(store?.id ?? "", { enabled: Boolean(store) });
  const salesFailed = Boolean(salesUpload && salesImport.isError);
  const salesApplied = salesConfirmed && !salesFailed;
  const ingredientCount = ingredients.data?.items.length ?? 0;
  const menuCount = salesImport.data?.detection?.menuCount;
  const salesSummary = [
    formatSalesPeriod(salesImport.data?.period),
    menuCount == null ? undefined : `메뉴 ${menuCount.toLocaleString("ko-KR")}개`,
  ].filter(Boolean);
  let salesValue = "나중에 올릴게요";
  if (salesFailed) {
    salesValue = "조회 실패";
  } else if (salesApplied) {
    salesValue = salesSummary.join(" · ") || "반영 완료";
  } else if (salesUpload) {
    salesValue = salesImport.data?.status === "NEEDS_CONFIRMATION" ? "열 확인 필요" : "확인 중…";
  }

  let ingredientValue = "등록된 재료 없음";
  if (ingredients.isError) {
    ingredientValue = "조회 실패";
  } else if (ingredients.isPending) {
    ingredientValue = "확인 중…";
  } else if (ingredientCount > 0) {
    ingredientValue = `${ingredientCount.toLocaleString("ko-KR")}개`;
  }

  const receiptSaved = receiptPhotoCount > 0;
  const summary = [
    ...(store?.name ? [{ label: "가게", value: store.name, pending: false }] : []),
    {
      label: "판매 기록",
      value: salesValue,
      pending: !salesApplied,
    },
    {
      label: "재료",
      value: ingredientValue,
      pending: ingredients.isPending || ingredients.isError || ingredientCount === 0,
    },
    {
      label: "거래처 영수증",
      // TODO(api): 확정 응답에서 실제 반영된 영수증 장수를 제공하면 표시한다.
      value: receiptSaved ? "반영 완료" : "나중에 할게요.",
      pending: !receiptSaved,
    },
  ];

  return (
    <OnboardingScreen
      completed
      receiptAttached={receiptSaved}
      wideCard
      scrollBody
      footer={
        <>
          <OnboardingButton onClick={() => navigate("/home", { replace: true })}>
            홈으로 가기
          </OnboardingButton>
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
        {salesApplied ? "판매 기록을 가게에 반영했어요." : "가게 정보를 입력했어요."}
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
      {(salesFailed || ingredients.isError) && (
        <div className="mt-4 grid gap-2">
          <OnboardingError>완료 내역을 모두 불러오지 못했어요.</OnboardingError>
          <OnboardingButton
            secondary
            disabled={(salesFailed && salesImport.isFetching) || ingredients.isFetching}
            onClick={() => {
              if (salesFailed) void salesImport.refetch();
              if (ingredients.isError) void ingredients.refetch();
            }}
          >
            다시 확인
          </OnboardingButton>
        </div>
      )}
    </OnboardingScreen>
  );
}
