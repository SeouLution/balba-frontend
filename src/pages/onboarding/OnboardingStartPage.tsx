import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";

import clockIcon from "./assets/clock.svg";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

const steps = [
  { name: "가게 정보", time: "30초" },
  { name: "POS 엑셀 올리기", time: "1분" },
  { name: "핵심 재료 고르기", time: "1분" },
  { name: "영수증 찍기", time: "1분", optional: true },
];

export function OnboardingStartPage() {
  const navigate = useNavigate();

  return (
    <OnboardingScreen
      onBack={() => navigate("/")}
      footer={
        <>
          <OnboardingButton onClick={() => navigate("store")}>내 가게로 시작하기</OnboardingButton>
          <OnboardingButton secondary onClick={() => navigate("/")}>
            먼저 둘러볼게요
          </OnboardingButton>
        </>
      }
    >
      <OnboardingHeading
        title={
          <>
            내일 몇 개 만들지
            <br />
            전날 밤에 알려드려요
          </>
        }
      >
        POS 매출 엑셀과 날씨로 메뉴별 준비량과 재료 발주량을 계산해요
      </OnboardingHeading>
      <ol className="mt-auto divide-y divide-border-divider rounded-md border border-border-grey px-4 py-1 text-body-s">
        {steps.map(({ name, time, optional }, index) => (
          <li key={name} className="flex min-h-14 items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-button-subtle text-caption">
              {index + 1}
            </span>
            <span>{name}</span>
            {optional && <Badge>선택</Badge>}
            <span className="ml-auto flex shrink-0 items-center gap-1 text-text-gray-darker">
              <img src={clockIcon} alt="" />
              {time}
            </span>
          </li>
        ))}
      </ol>
    </OnboardingScreen>
  );
}
