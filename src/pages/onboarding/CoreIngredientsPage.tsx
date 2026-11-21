import { useState } from "react";
import { useNavigate } from "react-router";

import { Pen } from "@/components/icons";
import { Stepper } from "@/components/Stepper";

import { ingredientMenuExamples, type RecipeExample } from "./ingredientExamples";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingDialog,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";
import { exampleSales } from "./salesColumns";

const previewLimit = 5;

function MenuIngredientsCard({
  menu,
  amounts,
  onEdit,
}: {
  menu: RecipeExample;
  amounts: Record<string, number>;
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? menu.items : menu.items.slice(0, previewLimit);
  const hiddenCount = menu.items.length - previewLimit;

  return (
    <article className="grid gap-4 rounded-sm border border-button-subtle p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-subtitle font-bold text-text-gray-darker">{menu.name}</h2>
        <button
          type="button"
          aria-label={`${menu.name} 재료 편집`}
          onClick={onEdit}
          className="relative flex size-7.5 shrink-0 items-center justify-end rounded-sm text-text-gray-light hover:text-button-primary focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
        >
          <Pen size={20} aria-hidden />
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(3,minmax(0,146px))] md:gap-4">
        {visibleItems.map(({ name, amount, unit }) => (
          <li
            key={name}
            className="flex min-h-10 flex-wrap items-center gap-x-2 rounded-sm bg-bg-page px-2.5 py-1.5 text-body-s md:text-body-l"
          >
            <span className="min-w-0 wrap-anywhere text-text-gray-light">{name}</span>
            <span className="font-semibold whitespace-nowrap text-text-gray-darker">
              {amounts[`${menu.name}/${name}`] ?? amount}
              {unit}
            </span>
          </li>
        ))}
        {hiddenCount > 0 && (
          <li>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className="min-h-10 rounded-sm px-1 text-left text-label-s whitespace-nowrap text-text-gray hover:text-button-primary focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none md:text-label-l"
            >
              {expanded ? "접기" : `+ ${hiddenCount}개 더보기`}
            </button>
          </li>
        )}
      </ul>
    </article>
  );
}

function EditMenuIngredients({
  menu,
  savedAmounts,
  onClose,
  onSave,
}: {
  menu: RecipeExample;
  savedAmounts: Record<string, number>;
  onClose: () => void;
  onSave: (amounts: Record<string, number>) => void;
}) {
  const [draft, setDraft] = useState<Record<string, number>>({});

  return (
    <OnboardingDialog title={`${menu.name} 재료 편집`} onClose={onClose}>
      <ul className="mb-4 divide-y divide-border-divider">
        {menu.items.map(({ name, amount, unit, step }) => {
          const key = `${menu.name}/${name}`;

          return (
            <li key={name} className="flex items-center justify-between gap-3 py-2 text-body-m">
              <span className="break-keep">{name}</span>
              <Stepper
                label={`${name} 사용량`}
                value={draft[key] ?? savedAmounts[key] ?? amount}
                unit={unit}
                step={step}
                onChange={(next) => setDraft((current) => ({ ...current, [key]: next }))}
              />
            </li>
          );
        })}
      </ul>
      <OnboardingButton className="w-full" onClick={() => onSave(draft)}>
        저장
      </OnboardingButton>
    </OnboardingDialog>
  );
}

export function CoreIngredientsPage() {
  const navigate = useNavigate();
  const { recipeAmounts, updateRecipeAmount, setIngredientIds } = useOnboarding();
  const [editingMenu, setEditingMenu] = useState<RecipeExample>();

  function confirmIngredients() {
    const selectedNames = new Set(
      ingredientMenuExamples.flatMap(({ name: menu, items }) =>
        items
          .filter(({ name, amount }) => (recipeAmounts[`${menu}/${name}`] ?? amount) > 0)
          .map(({ name }) => name),
      ),
    );
    setIngredientIds([...selectedNames]);
    navigate("../receipt");
  }

  return (
    <OnboardingScreen
      step={3}
      wideCard
      scrollBody
      progressPercent={48.75}
      onBack={() => navigate("../columns")}
      footer={<OnboardingButton onClick={confirmIngredients}>맞아요, 다음</OnboardingButton>}
    >
      <OnboardingHeading
        title={
          <>
            메뉴 {exampleSales.menuCount}에 들어가는
            <br />
            재료와 양을 추렸어요
          </>
        }
      >
        1인분에 들어가는 양이에요. 메뉴 이름만 보고 고른 거라 틀릴 수 있으니,
        <br className="hidden md:block" />
        다른 곳만 고쳐 주세요.
      </OnboardingHeading>
      <div className="grid gap-4 md:mt-5">
        {ingredientMenuExamples.map((menu) => (
          <MenuIngredientsCard
            key={menu.name}
            menu={menu}
            amounts={recipeAmounts}
            onEdit={() => setEditingMenu(menu)}
          />
        ))}
      </div>
      {editingMenu && (
        <EditMenuIngredients
          key={editingMenu.name}
          menu={editingMenu}
          savedAmounts={recipeAmounts}
          onClose={() => setEditingMenu(undefined)}
          onSave={(amounts) => {
            for (const [key, amount] of Object.entries(amounts)) updateRecipeAmount(key, amount);
            setEditingMenu(undefined);
          }}
        />
      )}
    </OnboardingScreen>
  );
}
