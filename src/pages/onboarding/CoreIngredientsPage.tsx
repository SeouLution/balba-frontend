import { useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Pen } from "@/components/icons";

import { EditMenuIngredientsDialog } from "./EditMenuIngredientsDialog";
import { ingredientMenuExamples } from "./ingredientExamples";
import { useOnboarding } from "./onboardingContext";
import { OnboardingButton, OnboardingHeading, OnboardingScreen } from "./OnboardingScreen";
import type { RecipeIngredient } from "./onboardingTypes";
import { getRecipeIngredients } from "./recipeIngredients";
import { exampleSales } from "./salesColumns";

const previewLimit = 5;

function MenuIngredientsCard({
  name,
  items,
  onEdit,
}: {
  name: string;
  items: RecipeIngredient[];
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, previewLimit);
  const hiddenCount = items.length - previewLimit;

  return (
    <article className="grid gap-4 rounded-sm border border-button-subtle p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-subtitle font-bold text-text-gray-darker">{name}</h2>
        <IconButton
          variant="plain"
          aria-label={`${name} 재료 편집`}
          onClick={onEdit}
          icon={<Pen size={20} />}
          className="flex h-7.5 w-7.5 items-center justify-end rounded-sm text-text-gray-light hover:text-button-primary focus-visible:ring-2 focus-visible:ring-button-primary"
        />
      </div>
      {items.length === 0 && <p className="text-body-s text-text-gray">등록된 재료가 없어요.</p>}
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(3,minmax(0,146px))] md:gap-4">
        {visibleItems.map(({ id, name, amount, unit }) => (
          <li key={id}>
            <Badge className="flex h-full min-h-10 flex-wrap items-center gap-x-2 gap-y-0 rounded-sm bg-bg-page px-2.5 py-1.5 text-body-s whitespace-normal md:text-body-l">
              <span className="min-w-0 wrap-anywhere text-text-gray-light">{name}</span>
              <span className="font-semibold whitespace-nowrap text-text-gray-darker">
                {amount}
                {unit}
              </span>
            </Badge>
          </li>
        ))}
        {hiddenCount > 0 && (
          <li>
            <Button
              variant="plain"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className="min-h-10 rounded-sm px-1 text-left text-label-s whitespace-nowrap text-text-gray hover:text-button-primary focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none md:text-label-l"
            >
              {expanded ? "접기" : `+ ${hiddenCount}개 더보기`}
            </Button>
          </li>
        )}
      </ul>
    </article>
  );
}

export function CoreIngredientsPage() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [editingMenuName, setEditingMenuName] = useState<string>();
  const menus = ingredientMenuExamples.map((menu) => ({
    name: menu.name,
    items: getRecipeIngredients(menu, onboarding),
  }));
  const editingMenu = menus.find(({ name }) => name === editingMenuName);

  function confirmIngredients() {
    const selectedNames = new Set(
      menus.flatMap(({ items }) =>
        items.filter(({ amount }) => amount > 0).map(({ name }) => name),
      ),
    );
    onboarding.setIngredientIds([...selectedNames]);
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
        {menus.map(({ name, items }) => (
          <MenuIngredientsCard
            key={name}
            name={name}
            items={items}
            onEdit={() => setEditingMenuName(name)}
          />
        ))}
      </div>
      {editingMenu && (
        <EditMenuIngredientsDialog
          key={editingMenu.name}
          menuName={editingMenu.name}
          ingredients={editingMenu.items}
          onClose={() => setEditingMenuName(undefined)}
          onSave={(items) => {
            onboarding.saveMenuIngredients(editingMenu.name, items);
            setEditingMenuName(undefined);
          }}
        />
      )}
    </OnboardingScreen>
  );
}
