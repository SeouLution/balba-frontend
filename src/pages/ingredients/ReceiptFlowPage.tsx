import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useStoreId } from "@/hooks/useStoreId";

import { CaptureStep } from "./CaptureStep";
import { ClassifyStep } from "./ClassifyStep";
import { ScheduleStep } from "./ScheduleStep";

const DEFAULT_RETURN_PATH = "/ingredients";

type ReceiptFlowStep =
  { name: "capture" } | { name: "classify"; scanId: string } | { name: "schedule"; scanId: string };

/** 3.5 → 3.6 → 3.7 영수증 흐름. 진입: /receipt?returnTo=돌아갈경로 */
export function ReceiptFlowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const storeId = useStoreId();
  const [step, setStep] = useState<ReceiptFlowStep>({ name: "capture" });

  function finishFlow() {
    // 끝난 흐름으로 뒤로 가기 되지 않도록 기록을 바꿔치기한다.
    navigate(readReturnPath(searchParams.get("returnTo")), { replace: true });
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
        onBack={leaveFlow}
        onUploaded={(scanId) => setStep({ name: "classify", scanId })}
      />
    );
  }

  if (step.name === "classify") {
    return (
      <ClassifyStep
        storeId={storeId}
        scanId={step.scanId}
        onBack={() => setStep({ name: "capture" })}
        onConfirmed={() => setStep({ name: "schedule", scanId: step.scanId })}
      />
    );
  }

  return (
    <ScheduleStep
      storeId={storeId}
      onBack={() => setStep({ name: "classify", scanId: step.scanId })}
      onSaved={finishFlow}
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
