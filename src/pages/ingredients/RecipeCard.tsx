import { useState } from "react";

import type { Recipe } from "@/api/recipes";
import { Pen } from "@/components/icons";

import { formatQuantity } from "./ingredientFormat";

const VISIBLE_ITEM_COUNT = 4;

type RecipeCardProps = {
  recipe: Recipe;
  onEdit: () => void;
};

/** 메뉴 하나의 재료와 1인분 양. 4개까지 보여주고 나머지는 "더보기"로 펼친다. */
export function RecipeCard({ recipe, onEdit }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hiddenCount = recipe.items.length - VISIBLE_ITEM_COUNT;
  const visibleItems = isExpanded ? recipe.items : recipe.items.slice(0, VISIBLE_ITEM_COUNT);

  return (
    <li className="rounded-lg border border-border-grey bg-button-surface-1 px-4 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-label-l text-text-black">{recipe.menu.name}</h3>
        <button
          type="button"
          aria-label={`${recipe.menu.name} 재료 수정`}
          onClick={onEdit}
          className="flex size-9 items-center justify-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          <Pen size={18} aria-hidden />
        </button>
      </div>

      {recipe.items.length === 0 ? (
        <p className="mt-2 text-caption text-text-gray">아직 등록된 재료가 없어요.</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-2">
          {visibleItems.map((item) => (
            <li
              key={item.ingredient.id}
              className="flex items-center gap-1.5 rounded-sm bg-bg-page px-2.5 py-1.5 text-caption"
            >
              <span className="text-text-gray">{item.ingredient.name}</span>
              <span className="font-semibold text-text-black">
                {formatQuantity(item.quantity.value, item.quantity.unit)}
              </span>
            </li>
          ))}
          {hiddenCount > 0 && !isExpanded && (
            <li>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-1 py-1.5 text-caption text-text-gray-darker outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
              >
                + {hiddenCount}개 더보기
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
}
