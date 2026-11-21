import { useState } from "react";
import { useNavigate } from "react-router";

import { CaptureStep } from "./CaptureStep";

// TODO: A와 storeId 보관 방식을 정하면 교체한다. 지금은 openapi.yaml 예시값.
const TEMP_STORE_ID = "st_8f2k1";

type ReceiptFlowStep = { name: "capture" } | { name: "classify"; scanId: string };

/** 3.5 → 3.6 → 3.7 영수증 흐름. 진입: /receipt?returnTo=돌아갈경로 */
export function ReceiptFlowPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ReceiptFlowStep>({ name: "capture" });

  if (step.name === "capture") {
    return (
      <CaptureStep
        storeId={TEMP_STORE_ID}
        onBack={() => navigate(-1)}
        onUploaded={(scanId) => setStep({ name: "classify", scanId })}
      />
    );
  }

  // TODO: 3.6 ClassifyStep, 3.7 ScheduleStep 연결
  return null;
}
