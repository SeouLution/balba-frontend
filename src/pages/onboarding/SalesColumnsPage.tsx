import { useState } from "react";
import { useNavigate } from "react-router";

import detectedIcon from "./assets/detected.svg";
import missingIcon from "./assets/missing.svg";
import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { SalesColumnEditor } from "./SalesColumnEditor";
import {
  exampleDetection,
  exampleHeaders,
  exampleSales,
  isCompleteMapping,
  salesColumns,
} from "./salesColumns";

export function SalesColumnsPage() {
  const navigate = useNavigate();
  const { mapping, setMapping, setSalesConfirmed } = useOnboarding();
  const [editing, setEditing] = useState(false);
  const ready = isCompleteMapping(mapping);
  const hasChanges = salesColumns.some(({ key }) => mapping[key] !== exampleDetection[key]);
  const { period, menuCount, recordCount } = exampleSales;

  if (editing) {
    return (
      <SalesColumnEditor
        detected={exampleDetection}
        initial={mapping}
        headers={exampleHeaders}
        onBack={() => setEditing(false)}
        onApply={(next) => {
          setMapping(next);
          setSalesConfirmed(false);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <OnboardingScreen
      step={2}
      onBack={() => navigate("../upload")}
      footer={
        <>
          {ready ? (
            <OnboardingButton
              onClick={() => {
                setSalesConfirmed(true);
                navigate("../ingredients");
              }}
            >
              이대로 반영하기
            </OnboardingButton>
          ) : (
            <OnboardingButton onClick={() => setEditing(true)}>칸 고치기</OnboardingButton>
          )}
          {ready && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="min-h-8 text-center text-label-s underline underline-offset-2"
            >
              칸 고치기
            </button>
          )}
        </>
      }
    >
      <OnboardingHeading
        title={hasChanges ? "수정한 칸을 확인해주세요" : "이렇게 읽었는데 맞나요?"}
      >
        {ready
          ? "날짜, 메뉴 이름, 판매 수량을 확인해주세요."
          : "빨간색으로 표시되어 있는 항목은 못 찾은 항목이에요. 칸 고치기를 눌러 수정해 주세요."}
      </OnboardingHeading>
      <p className="mb-2 text-caption text-text-gray-darker">열과 판매 기록은 예시 데이터예요.</p>
      <dl className="mb-3 grid grid-cols-3 gap-3">
        {[
          { label: "기간", value: period },
          {
            label: "메뉴",
            value: menuCount,
          },
          { label: "판매 기록", value: recordCount },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="min-w-0 rounded-md border border-border-grey bg-bg-page px-2.5 py-3 md:p-4"
          >
            <dt className="text-caption text-text-gray-darker">{label}</dt>
            <dd className="mt-1 text-body-m">{value}</dd>
          </div>
        ))}
      </dl>
      <dl className="divide-y divide-border-divider rounded-md border border-border-grey px-4 py-1">
        {salesColumns.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-h-12 items-center justify-between gap-4 py-2 text-label-s"
          >
            <dt className="shrink-0 text-text-gray-darker">{label}</dt>
            <dd className="flex min-w-0 items-center gap-1.5 text-right">
              {mapping[key] ? (
                <span className="wrap-anywhere">‘{mapping[key]}’ 칸</span>
              ) : (
                <span className="text-text-gray">미확인 항목</span>
              )}
              <img src={mapping[key] ? detectedIcon : missingIcon} alt="" className="shrink-0" />
            </dd>
          </div>
        ))}
      </dl>
    </OnboardingScreen>
  );
}
