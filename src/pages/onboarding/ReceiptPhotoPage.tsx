import { useRef, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router";

import { InfoBox } from "@/components/InfoBox";
import { TopBar } from "@/components/TopBar";

import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

export function ReceiptPhotoPage() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const { receiptPhotoCount, addReceiptPhotos, salesConfirmed } = useOnboarding();
  const fromCompletion = useLocation().state?.fromCompletion === true;

  function leaveReceipt(path: string) {
    if (fromCompletion) {
      navigate(-1);
      return;
    }
    navigate(path);
  }

  function recordSelection(event: ChangeEvent<HTMLInputElement>) {
    const count = event.currentTarget.files?.length ?? 0;
    if (count) addReceiptPhotos(count);
    event.currentTarget.value = "";
  }

  return (
    <OnboardingScreen
      step={4}
      receiptAttached={receiptPhotoCount > 0}
      progressPercent={65}
      wideCard
      scrollBody
      header={
        <TopBar
          step={{ current: 4, total: 4 }}
          onBack={() => leaveReceipt(salesConfirmed ? "../ingredients" : "../upload")}
          className="h-[72px] pr-5 pl-2 md:h-20 md:pt-5 md:pr-10 md:pb-4 md:pl-5 [&>span]:font-semibold"
        />
      }
      footer={
        <OnboardingButton
          secondary={!receiptPhotoCount}
          onClick={() => leaveReceipt(salesConfirmed ? "../recipes" : "../complete")}
        >
          {receiptPhotoCount > 0 ? "다음" : "나중에 할게요."}
        </OnboardingButton>
      }
    >
      <OnboardingHeading
        className="mb-4"
        title={
          <>
            거래처 영수증을
            <br />
            찍어주세요
          </>
        }
      >
        거래처와 재료 단가를 한 번에 채워요. 따로 등록할 필요 없어요
      </OnboardingHeading>
      <div className="grid gap-4">
        <div className="grid gap-2.5 rounded-md bg-surface-receipt-action px-5 py-6 text-center">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            hidden
            onChange={recordSelection}
          />
          <OnboardingButton onClick={() => fileInput.current?.click()}>
            영수증 사진 찍기
          </OnboardingButton>
          <p role="status" className="text-body-s text-text-information">
            {receiptPhotoCount > 0
              ? `영수증 사진 ${receiptPhotoCount}장을 선택했어요`
              : "여러 장 연속 촬영으로 이어져요"}
          </p>
        </div>
        <section className="grid gap-3 rounded-md border border-button-subtle p-4">
          <h2 className="text-label-s-b font-semibold">이렇게 찍으면 돼요</h2>
          <ul className="grid list-disc gap-1.5 pl-6 text-body-s">
            <li>최근 1~2주 영수증을 거래처 상관없이 연달아</li>
            <li>한 장만 찍어도 시작할 수 있어요</li>
            <li>거래처·날짜는 앱이 알아서 나눠요</li>
          </ul>
          <InfoBox className="bg-surface-info">
            지금 건너뛰면 재료 단가가 비어 있어 발주 금액을 계산할 수 없어요.
            <br />
            홈에서 언제든 찍을 수 있어요
          </InfoBox>
        </section>
      </div>
    </OnboardingScreen>
  );
}
