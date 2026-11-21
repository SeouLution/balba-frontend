import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useStoreId } from "@/hooks/useStoreId";

import { CaptureStep } from "./CaptureStep";
import { ReceiptReviewStep } from "./ReceiptReviewStep";

const DEFAULT_RETURN_PATH = "/ingredients";

type ReceiptFlowStep = { name: "capture" } | { name: "review"; scanId: string; photoCount: number };

type ReceiptFlowPageProps = {
  storeId?: string;
  onBack?: () => void;
  onSaved?: (photoCount: number) => void;
};

/** 돌아간 화면이 읽는 값. 재료 탭은 이걸로 "정보가 입력됐어요" 카드를 띄운다. */
export type ReceiptFlowResult = {
  receiptIngredientNames: string[];
};

/** 영수증 연속 촬영 → 읽기 · 저장. 진입: /receipt?returnTo=돌아갈경로 */
export function ReceiptFlowPage({ storeId: entryStoreId, onBack, onSaved }: ReceiptFlowPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentStoreId = useStoreId();
  const storeId = entryStoreId ?? currentStoreId;
  const [step, setStep] = useState<ReceiptFlowStep>({ name: "capture" });

  function finishFlow(ingredientNames: string[]) {
    const result: ReceiptFlowResult = { receiptIngredientNames: ingredientNames };
    // 끝난 흐름으로 뒤로 가기 되지 않도록 기록을 바꿔치기한다.
    navigate(readReturnPath(searchParams.get("returnTo")), { replace: true, state: result });
  }

  function leaveFlow() {
    // 새 탭 · 새로고침으로 바로 열면 앱 안에 뒤로 갈 기록이 없다(key가 "default").
    // 그때 navigate(-1)은 아무 일도 안 하거나 앱 밖으로 나가므로 복귀 경로로 보낸다.
    if (location.key === "default") {
      navigate(readReturnPath(searchParams.get("returnTo")), { replace: true });
      return;
    }
    navigate(-1);
  }

  if (step.name === "capture") {
    return (
      <CaptureStep
        storeId={storeId}
        onBack={onBack ?? leaveFlow}
        onUploaded={(scanId, photoCount) => setStep({ name: "review", scanId, photoCount })}
      />
    );
  }

  return (
    <ReceiptReviewStep
      storeId={storeId}
      scanId={step.scanId}
      onBack={() => setStep({ name: "capture" })}
      onConfirmed={onSaved ? () => onSaved(step.photoCount) : finishFlow}
    />
  );
}

// 앱 안의 경로("/...")만 허용하고, 외부 주소("//evil.com")로는 보내지 않는다.
function readReturnPath(returnTo: string | null) {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return DEFAULT_RETURN_PATH;
}
