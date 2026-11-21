import { useState } from "react";
import { useNavigate } from "react-router";

import { CaptureStep } from "./CaptureStep";
import { ClassifyStep } from "./ClassifyStep";

// TODO: A와 storeId 보관 방식을 정하면 교체한다. 지금은 openapi.yaml 예시값.
const TEMP_STORE_ID = "st_8f2k1";

type ReceiptFlowStep =
  { name: "capture" } | { name: "classify"; scanId: string } | { name: "schedule" };

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

  if (step.name === "classify") {
    return (
      <ClassifyStep
        storeId={TEMP_STORE_ID}
        scanId={step.scanId}
        onBack={() => setStep({ name: "capture" })}
        onConfirmed={() => setStep({ name: "schedule" })}
      />
    );
  }

  // TODO: 3.7 ScheduleStep 연결
  return null;
}
