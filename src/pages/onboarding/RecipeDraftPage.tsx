import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { Chip } from "@/components/Chip";
import { DropdownOption } from "@/components/DropdownOption";
import { InfoBox } from "@/components/InfoBox";
import { Select } from "@/components/Select";
import { TextField } from "@/components/TextField";
import { TopBar } from "@/components/TopBar";

import { ingredientMenuExamples, recipeExamples } from "./ingredientExamples";
import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import { getRecipeIngredients } from "./recipeIngredients";

export function RecipeDraftPage() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [recipeIndex, setRecipeIndex] = useState(0);
  const menus = [
    ...recipeExamples,
    ...ingredientMenuExamples.filter(
      ({ name }) =>
        onboarding.editedMenuIngredients[name] &&
        !recipeExamples.some((menu) => menu.name === name),
    ),
  ];
  const recipe = menus[recipeIndex];
  const ingredients = getRecipeIngredients(recipe, onboarding);

  return (
    <OnboardingScreen
      step={4}
      sidebarStep={5}
      receiptAttached={onboarding.receiptPhotoCount > 0}
      wideCard
      scrollBody
      header={
        <TopBar
          onBack={() => navigate("../receipt")}
          className="h-[72px] pr-5 pl-2 md:h-20 md:pt-5 md:pr-10 md:pb-4 md:pl-5"
          endContent={
            <Badge type="ai" className="gap-1.25 px-2.5 font-medium">
              AI 초안
            </Badge>
          }
        />
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
        엑셀의 메뉴 이름을 보고 만든 초안이에요. 필요한 수량과 단위를 고쳐주세요.
      </OnboardingHeading>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="레시피 메뉴">
        {menus.map(({ name }, index) => (
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
        {ingredients.length === 0 && (
          <p className="mt-2 text-body-s text-text-gray">등록된 재료가 없어요.</p>
        )}
        <ul className="divide-y divide-border-divider">
          {ingredients.map(({ id, name, amount, unit }) => {
            const key = `${recipe.name}/${id}`;
            return (
              <li key={key} className="flex items-center justify-between gap-2 py-2 text-body-l">
                <span className="min-w-0 break-keep">{name}</span>
                <div className="grid shrink-0 grid-cols-[repeat(2,4.5rem)] gap-2 md:grid-cols-[repeat(2,5rem)] md:gap-3">
                  <TextField
                    label={`${name} 사용량`}
                    hideLabel
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    defaultValue={amount}
                    className="[appearance:textfield] rounded-sm border-border-primary px-3.5 text-label-l text-text-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    onChange={(event) => {
                      const nextAmount = event.currentTarget.valueAsNumber;
                      if (Number.isFinite(nextAmount) && nextAmount >= 0) {
                        onboarding.updateRecipeAmount(key, nextAmount);
                      }
                    }}
                    onBlur={(event) => {
                      const input = event.currentTarget;
                      if (!Number.isFinite(input.valueAsNumber) || input.valueAsNumber < 0) {
                        input.value = String(amount);
                      }
                    }}
                  />
                  <Select
                    label={`${name} 단위`}
                    hideLabel
                    indicatorClassName="right-2.5 text-text-black"
                    value={unit}
                    className="rounded-sm border-border-grey pr-8 pl-3.5 text-label-l text-text-black"
                    onChange={(event) => {
                      const nextUnit = event.currentTarget.value;
                      if (nextUnit === "개" || nextUnit === "g")
                        onboarding.updateRecipeUnit(key, nextUnit);
                    }}
                  >
                    <DropdownOption value="개">개</DropdownOption>
                    <DropdownOption value="g">g</DropdownOption>
                  </Select>
                </div>
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
