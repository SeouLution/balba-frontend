import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { Checkbox } from "@/components/Checkbox";
import { Chip } from "@/components/Chip";

import { ingredientExamples, recommendedIds } from "./ingredientExamples";
import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";

export function CoreIngredientsPage() {
  const navigate = useNavigate();
  const { ingredientIds, setIngredientIds } = useOnboarding();
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const selected = ingredientIds ?? recommendedIds;
  const visible = recommendedOnly
    ? ingredientExamples.filter(({ recommended }) => recommended)
    : ingredientExamples;

  function toggle(id: string) {
    setIngredientIds(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  }

  return (
    <OnboardingScreen
      step={3}
      onBack={() => navigate("../columns")}
      footer={
        <OnboardingButton
          disabled={!selected.length}
          onClick={() => {
            setIngredientIds(selected);
            navigate("../recipes");
          }}
        >
          {selected.length}개로 시작하기
        </OnboardingButton>
      }
    >
      <OnboardingHeading
        title={
          <>
            먼저 관리할 핵심 재료를 <br className="md:hidden" />
            골라주세요
          </>
        }
      >
        예시 목록에서 자주 쓰거나 관리가 필요한 재료를 골라주세요.
      </OnboardingHeading>
      <div className="mb-2 flex flex-wrap gap-2">
        <Chip selected={!recommendedOnly} onClick={() => setRecommendedOnly(false)}>
          전체 {ingredientExamples.length}개
        </Chip>
        <Chip selected={recommendedOnly} onClick={() => setRecommendedOnly(true)}>
          추천만
        </Chip>
      </div>
      <ul className="divide-y divide-border-divider">
        {visible.map(({ id, name, menus, recommended }) => (
          <li key={id}>
            <Checkbox
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
              className="min-h-15 w-full items-start gap-3 py-2.5 [&>span:first-child]:mt-0.5"
              label={
                <span className="grid gap-1">
                  <span className="flex flex-wrap items-center gap-2 text-label-s-b">
                    {name}
                    {recommended && <Badge className="h-6">추천</Badge>}
                  </span>
                  <span className="text-caption text-text-gray-darker">{menus}</span>
                </span>
              }
            />
          </li>
        ))}
      </ul>
    </OnboardingScreen>
  );
}
