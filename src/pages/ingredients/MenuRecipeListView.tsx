import { useNavigate } from "react-router";

import { Button } from "@/components";
import { Loading } from "@/components/Loading";
import { useRecipes } from "@/hooks/useRecipes";

import { byKoreanName } from "./ingredientFormat";
import { recipeEditPath } from "./ingredientPaths";
import { RecipeCard } from "./RecipeCard";

/** 메뉴별: 메뉴마다 들어가는 재료와 1인분 양 */
export function MenuRecipeListView({ storeId }: { storeId: string }) {
  const navigate = useNavigate();
  const recipesQuery = useRecipes(storeId);

  if (recipesQuery.isPending) return <Loading>메뉴를 불러오고 있어요.</Loading>;

  if (recipesQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-body-m text-text-gray-darker">메뉴를 불러오지 못했어요.</p>
        <Button variant="secondary" onClick={() => recipesQuery.refetch()}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  if (recipesQuery.data.generationStatus === "GENERATING") {
    return <Loading>메뉴별 재료를 추리고 있어요.</Loading>;
  }

  const recipes = [...recipesQuery.data.items].sort(byKoreanName((recipe) => recipe.menu.name));

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-label-s-b text-text-black">메뉴 {recipes.length}개</span>
        <span className="text-caption text-text-gray">가나다 순</span>
      </div>

      {recipes.length === 0 ? (
        <p className="py-12 text-center text-body-m text-text-gray-darker">
          아직 메뉴가 없어요. 판매 엑셀을 올려 메뉴를 추가해 주세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.menu.id}
              recipe={recipe}
              onEdit={() => navigate(recipeEditPath(recipe.menu.id, "/ingredients?tab=menus"))}
            />
          ))}
        </ul>
      )}
    </>
  );
}
