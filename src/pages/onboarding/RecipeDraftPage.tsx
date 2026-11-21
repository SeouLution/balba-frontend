import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { Chip } from "@/components/Chip";
import { ChevronLeft } from "@/components/icons";
import { InfoBox } from "@/components/InfoBox";
import { Stepper } from "@/components/Stepper";

import { recipeExamples } from "./ingredientExamples";
import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

export function RecipeDraftPage() {
  const navigate = useNavigate();
  const { recipeAmounts, updateRecipeAmount } = useOnboarding();
  const [recipeIndex, setRecipeIndex] = useState(0);
  const recipe = recipeExamples[recipeIndex];

  return (
    <OnboardingScreen
      step={4}
      sidebarStep={5}
      wideCard
      scrollBody
      header={
        <header className="flex h-[72px] items-center justify-between pr-5 pl-2 md:h-20 md:pt-5 md:pr-10 md:pb-4 md:pl-5">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => navigate("../receipt")}
            className="grid size-11 place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
          >
            <ChevronLeft size={24} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
          </button>
          <Badge type="ai" className="gap-1.25 px-2.5 font-medium">
            AI 초안
          </Badge>
        </header>
      }
      footer={<OnboardingButton onClick={() => navigate("../complete")}>저장하기</OnboardingButton>}
    >
      <OnboardingHeading
        className="mb-4"
        title={
          <>
            메뉴별 재료량을
            <br />
            미리 채워뒀어요
          </>
        }
      >
        엑셀의 메뉴 이름을 보고 만든 초안이에요. 숫자만 고쳐주세요
      </OnboardingHeading>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="레시피 메뉴">
        {recipeExamples.map(({ name }, index) => (
          <Chip
            key={name}
            className="font-semibold"
            selected={recipeIndex === index}
            onClick={() => setRecipeIndex(index)}
          >
            {name}
          </Chip>
        ))}
      </div>
      <section
        aria-label={`${recipe.name} 레시피`}
        className="rounded-md border border-button-subtle p-4"
      >
        <h2 className="text-body-s text-text-gray-darker">
          {recipe.name} 1{recipe.unit}에 들어가는 양
        </h2>
        <ul className="divide-y divide-border-divider">
          {recipe.items.map(({ name, amount, unit, step }) => {
            const key = `${recipe.name}/${name}`;
            return (
              <li key={key} className="flex items-center justify-between gap-2 py-2 text-body-l">
                <span>{name}</span>
                <Stepper
                  label={`${name} 사용량`}
                  className="w-40 shrink-0 md:w-45"
                  buttonClassName="rounded-sm border-border-grey text-text-black"
                  valueClassName="flex-1 text-number font-semibold text-text-black"
                  value={recipeAmounts[key] ?? amount}
                  unit={unit}
                  step={step}
                  onChange={(next) => updateRecipeAmount(key, next)}
                />
              </li>
            );
          })}
        </ul>
      </section>
      <InfoBox className="mt-4 bg-surface-info">
        처음엔 대략이어도 괜찮아요. 매주 실제 구매량과 비교해서 고쳐드려요
      </InfoBox>
    </OnboardingScreen>
  );
}
