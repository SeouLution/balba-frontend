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
      header={
        <header className="flex h-[72px] items-center justify-between pr-5 pl-2 md:h-20 md:pr-10 md:pl-5">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => navigate("../ingredients")}
            className="grid size-11 place-items-center rounded-sm focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
          >
            <ChevronLeft size={24} aria-hidden />
          </button>
          <Badge type="ai">AI 초안</Badge>
        </header>
      }
      footer={
        <>
          <InfoBox type="ai">
            발주량 계산에 쓰이는 예시예요. 가게에서 쓰는 양에 맞게 조정해 보세요.
          </InfoBox>
          <OnboardingButton onClick={() => navigate("../complete")}>
            저장하고 계속하기
          </OnboardingButton>
        </>
      }
    >
      <OnboardingHeading
        title={
          <>
            메뉴별 레시피를 <br className="md:hidden" />
            확인해주세요
          </>
        }
      >
        메뉴 하나를 만들 때 들어가는 재료 양을 확인하고 맞춰주세요.
      </OnboardingHeading>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="레시피 메뉴">
        {recipeExamples.map(({ name }, index) => (
          <Chip
            key={name}
            size="M"
            selected={recipeIndex === index}
            onClick={() => setRecipeIndex(index)}
          >
            {name}
          </Chip>
        ))}
      </div>
      <section
        aria-label={`${recipe.name} 레시피`}
        className="md:rounded-md md:border md:border-border-grey md:p-4"
      >
        <h2 className="mb-2 text-label-s-b">
          {recipe.name} 1{recipe.unit}에 들어가는 양
        </h2>
        <ul className="divide-y divide-border-divider">
          {recipe.items.map(({ name, amount, unit, step }) => {
            const key = `${recipe.name}/${name}`;
            return (
              <li
                key={key}
                className="flex min-h-15 items-center justify-between gap-2 py-2 text-body-m"
              >
                <span>{name}</span>
                <Stepper
                  label={`${name} 사용량`}
                  className="w-45 shrink-0 justify-between"
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
    </OnboardingScreen>
  );
}
