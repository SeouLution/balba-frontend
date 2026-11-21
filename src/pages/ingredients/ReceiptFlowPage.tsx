import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { CaptureStep } from "./CaptureStep";
import { ClassifyStep } from "./ClassifyStep";
import { ScheduleStep } from "./ScheduleStep";

// TODO: A와 storeId 보관 방식을 정하면 교체한다. 지금은 openapi.yaml 예시값.
const TEMP_STORE_ID = "st_8f2k1";

// TODO: 3.2 재료 탭 라우트가 생기면 "/ingredients"로 바꾼다.
const DEFAULT_RETURN_PATH = "/";

type ReceiptFlowStep =
  { name: "capture" } | { name: "classify"; scanId: string } | { name: "schedule"; scanId: string };

/** 3.5 → 3.6 → 3.7 영수증 흐름. 진입: /receipt?returnTo=돌아갈경로 */
export function ReceiptFlowPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<ReceiptFlowStep>({ name: "capture" });

  function finishFlow() {
    // 끝난 흐름으로 뒤로 가기 되지 않도록 기록을 바꿔치기한다.
    navigate(readReturnPath(searchParams.get("returnTo")), { replace: true });
  }

  if (step.name === "capture") {
    return (
      <CaptureStep
        storeId={TEMP_STORE_ID}
        onBack={() => navigate(-1)}
        onUploaded={(scanId) => setStep({ name: "classify", scanId })}
      />
    );
  }

  if (step.name === "classify") {
    return (
      <ClassifyStep
        storeId={TEMP_STORE_ID}
        scanId={step.scanId}
        onBack={() => setStep({ name: "capture" })}
        onConfirmed={() => setStep({ name: "schedule", scanId: step.scanId })}
      />
    );
  }

  return (
    <ScheduleStep
      storeId={TEMP_STORE_ID}
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
