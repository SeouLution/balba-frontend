import { request } from "@/api/client";
import type { IngredientUnit } from "@/api/ingredients";

export type RecipeItem = {
  ingredient: { id: string; name: string };
  // 메뉴 1인분당 사용량 · 재료 단위
  quantity: { value: number; unit: IngredientUnit };
};

export type Recipe = {
  menu: { id: string; name: string };
  unit: string;
  items: RecipeItem[];
};

// GENERATING이면 AI가 레시피를 만드는 중이라 items가 비어 있다.
export type RecipeGenerationStatus = "GENERATING" | "READY";

export type RecipeList = {
  generationStatus: RecipeGenerationStatus;
  items: Recipe[];
};

export type SaveRecipesRequest = {
  items: {
    menuId: string;
    items: { ingredientId: string; quantity: number }[];
  }[];
};

export function listRecipes(storeId: string) {
  return request<RecipeList>(`/v1/stores/${storeId}/recipes`);
}

/** 요청에 담긴 메뉴마다 레시피 전체를 바꾼다. 요청에 없는 메뉴는 그대로 둔다. */
export function saveRecipes(storeId: string, body: SaveRecipesRequest) {
  return request<void>(`/v1/stores/${storeId}/recipes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
