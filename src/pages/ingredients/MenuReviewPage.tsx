import { useNavigate } from "react-router";

import { Button } from "@/components";
import { Loading } from "@/components/Loading";
import { useRecipes } from "@/hooks/useRecipes";
import { useStoreId } from "@/hooks/useStoreId";

import { byKoreanName } from "./ingredientFormat";
import { ReceiptStepLayout } from "./ReceiptStepLayout";
import { recipeEditPath } from "./ingredientPaths";
import { RecipeCard } from "./RecipeCard";

const REVIEW_PATH = "/ingredients/menus/review";

/**
 * 메뉴 추가 결과 확인. AI가 만든 레시피는 이미 저장돼 있고, 고친 메뉴는 수정 화면에서 바로 저장된다.
 * 그래서 "등록하기"는 메뉴별 탭으로 돌아가기만 한다.
 */
export function MenuReviewPage() {
  const navigate = useNavigate();
  const storeId = useStoreId();
  const recipesQuery = useRecipes(storeId);
  const finish = () => navigate("/ingredients?tab=menus", { replace: true });

  if (recipesQuery.isPending || recipesQuery.data?.generationStatus === "GENERATING") {
    return (
      <ReceiptStepLayout title="" onBack={finish}>
        <Loading>메뉴별 재료를 추리고 있어요.</Loading>
      </ReceiptStepLayout>
    );
  }

  if (recipesQuery.isError) {
    return (
      <ReceiptStepLayout title="" onBack={finish}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">메뉴를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={() => recipesQuery.refetch()}>
            다시 불러오기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  const recipes = [...recipesQuery.data.items].sort(byKoreanName((recipe) => recipe.menu.name));

  return (
    <ReceiptStepLayout
      title=""
      onBack={finish}
      footer={
        <Button onClick={finish} className="w-full">
          등록하기
        </Button>
      }
    >
      <h2 className="pt-2 text-subtitle text-text-black">
        메뉴 {recipes.length}개에 들어가는
        <br />
        재료와 양을 추렸어요
      </h2>
      <p className="text-body-s text-text-gray-darker">
        1인분에 들어가는 양이에요.
        <br />
        메뉴 이름만 보고 고른 거라 틀릴 수 있으니,
        <br />
        다른 곳만 고쳐 주세요.
      </p>
      <ul className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.menu.id}
            recipe={recipe}
            onEdit={() => navigate(recipeEditPath(recipe.menu.id, REVIEW_PATH))}
          />
        ))}
      </ul>
    </ReceiptStepLayout>
  );
}
