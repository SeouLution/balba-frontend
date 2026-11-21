import { useState } from "react";
import { useNavigate } from "react-router";

import type { Recipe } from "@/api/recipes";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { Pen } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { useRecipes } from "@/hooks/useRecipes";

import { EditMenuIngredientsDialog } from "./EditMenuIngredientsDialog";
import { useOnboarding } from "./onboardingContext";
import {
  OnboardingButton,
  OnboardingError,
  OnboardingHeading,
  OnboardingScreen,
} from "./OnboardingScreen";

const previewLimit = 5;

function MenuIngredientsCard({
  recipe: {
    menu: { name },
    items,
  },
  onEdit,
}: {
  recipe: Recipe;
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
        {visibleItems.map(({ ingredient, quantity }) => (
          <li key={ingredient.id}>
            <Badge className="flex h-full min-h-10 flex-wrap items-center gap-x-2 gap-y-0 rounded-sm bg-bg-page px-2.5 py-1.5 text-body-s whitespace-normal md:text-body-l">
              <span className="min-w-0 wrap-anywhere text-text-gray-light">{ingredient.name}</span>
              <span className="font-semibold whitespace-nowrap text-text-gray-darker">
                {quantity.value}
                {quantity.unit}
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
  const { store } = useOnboarding();
  const storeId = store?.id ?? "";
  const recipes = useRecipes(storeId, { enabled: Boolean(store) });
  const [editingMenuId, setEditingMenuId] = useState<string>();
  const menus = recipes.data?.items ?? [];
  const editingMenu = menus.find(({ menu }) => menu.id === editingMenuId);

  return (
    <OnboardingScreen
      step={3}
      wideCard
      scrollBody
      progressPercent={48.75}
      onBack={() => navigate("../upload")}
      footer={
        recipes.isError ? (
          <OnboardingButton disabled={recipes.isFetching} onClick={() => void recipes.refetch()}>
            다시 확인
          </OnboardingButton>
        ) : recipes.data?.generationStatus === "READY" ? (
          <OnboardingButton onClick={() => navigate("../receipt")}>맞아요, 다음</OnboardingButton>
        ) : null
      }
    >
      <OnboardingHeading title="메뉴별 재료와 양을 확인해 주세요">
        메뉴 1인분에 들어가는 재료와 양을 확인하고 필요한 곳을 고쳐 주세요.
      </OnboardingHeading>
      {recipes.isError ? (
        <OnboardingError>메뉴별 재료를 불러오지 못했어요. 다시 확인해 주세요.</OnboardingError>
      ) : recipes.data?.generationStatus !== "READY" ? (
        <Loading>메뉴별 재료와 양을 확인하고 있어요.</Loading>
      ) : menus.length === 0 ? (
        <p className="text-body-s text-text-gray">확인할 메뉴가 없어요.</p>
      ) : (
        <div className="grid gap-4 md:mt-5">
          {menus.map((recipe) => (
            <MenuIngredientsCard
              key={recipe.menu.id}
              recipe={recipe}
              onEdit={() => setEditingMenuId(recipe.menu.id)}
            />
          ))}
        </div>
      )}
      {editingMenu && (
        <EditMenuIngredientsDialog
          key={editingMenu.menu.id}
          storeId={storeId}
          recipe={editingMenu}
          onClose={() => setEditingMenuId(undefined)}
        />
      )}
    </OnboardingScreen>
  );
}
