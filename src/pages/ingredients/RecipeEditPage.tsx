import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import type { IngredientSummary } from "@/api/ingredients";
import type { Recipe } from "@/api/recipes";
import { Button, DropdownOption, Select, TextField } from "@/components";
import { Plus, X } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecipes, useSaveRecipes } from "@/hooks/useRecipes";
import { useStoreId } from "@/hooks/useStoreId";

import { byKoreanName } from "./ingredientFormat";
import { ReceiptStepLayout } from "./ReceiptStepLayout";

const DEFAULT_RETURN_PATH = "/ingredients?tab=menus";

/** 메뉴 하나의 재료 · 1인분 양 수정. 진입: /ingredients/recipes/:menuId?returnTo=돌아갈경로 */
export function RecipeEditPage() {
  const { menuId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeId = useStoreId();
  const recipesQuery = useRecipes(storeId);
  const ingredientsQuery = useIngredients(storeId);
  const returnTo = readReturnPath(searchParams.get("returnTo"));
  const goBack = () => navigate(returnTo, { replace: true });

  if (recipesQuery.isPending || ingredientsQuery.isPending) {
    return (
      <ReceiptStepLayout title="재료 수정" onBack={goBack}>
        <Loading />
      </ReceiptStepLayout>
    );
  }

  const recipe = recipesQuery.data?.items.find((item) => item.menu.id === menuId);
  if (recipesQuery.isError || ingredientsQuery.isError || !recipe) {
    return (
      <ReceiptStepLayout title="재료 수정" onBack={goBack}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">메뉴 정보를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={goBack}>
            돌아가기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  return (
    <RecipeEditForm
      key={recipe.menu.id}
      storeId={storeId}
      recipe={recipe}
      ingredients={[...ingredientsQuery.data.items].sort(byKoreanName((item) => item.name))}
      onDone={goBack}
    />
  );
}

type DraftRow = {
  rowKey: number;
  ingredientId: string;
  quantity: string;
};

type RecipeEditFormProps = {
  storeId: string;
  recipe: Recipe;
  ingredients: IngredientSummary[];
  onDone: () => void;
};

// TODO(api): 이름을 직접 쳐서 새 재료를 만드는 API가 없어, 이미 있는 재료 중에서 고르게 했다.
//            재료 단위(개 · g)는 재료마다 정해져 있어 바꿀 수 없다.
function RecipeEditForm({ storeId, recipe, ingredients, onDone }: RecipeEditFormProps) {
  const saveRecipes = useSaveRecipes(storeId);
  const [rows, setRows] = useState<DraftRow[]>(() =>
    recipe.items.map((item, index) => ({
      rowKey: index,
      ingredientId: item.ingredient.id,
      quantity: String(item.quantity.value),
    })),
  );
  const [nextRowKey, setNextRowKey] = useState(recipe.items.length);

  const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const isValid = rows.every((row) => row.ingredientId && row.quantity !== "");

  function updateRow(rowKey: number, change: Partial<DraftRow>) {
    setRows((prev) => prev.map((row) => (row.rowKey === rowKey ? { ...row, ...change } : row)));
  }

  function addRow() {
    setRows((prev) => [{ rowKey: nextRowKey, ingredientId: "", quantity: "" }, ...prev]);
    setNextRowKey((key) => key + 1);
  }

  function handleSave() {
    saveRecipes.mutate(
      {
        items: [
          {
            menuId: recipe.menu.id,
            items: rows.map((row) => ({
              ingredientId: row.ingredientId,
              quantity: Number(row.quantity),
            })),
          },
        ],
      },
      { onSuccess: onDone },
    );
  }

  return (
    <ReceiptStepLayout
      title={`‘${recipe.menu.name}’ 재료 수정`}
      onBack={onDone}
      footer={
        <>
          {saveRecipes.isError && (
            <p className="mb-2 text-center text-caption text-danger-subtle-text">
              저장하지 못했어요. 다시 눌러 주세요.
            </p>
          )}
          <Button
            disabled={!isValid || saveRecipes.isPending}
            onClick={handleSave}
            className="w-full"
          >
            {saveRecipes.isPending ? "저장하는 중이에요" : "저장"}
          </Button>
        </>
      }
    >
      <button
        type="button"
        onClick={addRow}
        className="flex h-12 items-center justify-center gap-2 rounded-sm border border-dashed border-border-primary text-label-s text-text-black outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <Plus size={18} aria-hidden />
        재료 추가하기
      </button>

      <ul className="flex flex-col gap-3">
        {rows.map((row) => {
          // 같은 메뉴에 같은 재료를 두 번 넣을 수 없어서, 다른 줄에서 고른 재료는 빼고 보여준다.
          const takenIds = new Set(
            rows.filter((other) => other.rowKey !== row.rowKey).map((other) => other.ingredientId),
          );
          const options = ingredients.filter((ingredient) => !takenIds.has(ingredient.id));
          const unit = ingredientById.get(row.ingredientId)?.unit ?? "-";

          return (
            <li
              key={row.rowKey}
              className="grid grid-cols-[1fr_4.5rem_4.75rem_1.75rem] items-end gap-2"
            >
              <Select
                label="재료이름"
                placeholder="재료 선택"
                className="form-select-scroll"
                value={row.ingredientId}
                onChange={(event) => updateRow(row.rowKey, { ingredientId: event.target.value })}
              >
                {options.map((ingredient) => (
                  <DropdownOption key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </DropdownOption>
                ))}
              </Select>
              <TextField
                label="1인분 양"
                inputMode="decimal"
                value={row.quantity}
                onChange={(event) =>
                  updateRow(row.rowKey, { quantity: event.target.value.replace(/[^0-9.]/g, "") })
                }
                className="px-3"
              />
              {/* 단위는 재료마다 정해져 있어(개 · g) 고를 수 없게 막아 둔다. */}
              <Select label="단위" value={unit} disabled onChange={() => {}} className="pr-9 pl-3">
                <DropdownOption value={unit}>{unit}</DropdownOption>
              </Select>
              <button
                type="button"
                aria-label="이 재료 빼기"
                onClick={() =>
                  setRows((prev) => prev.filter((other) => other.rowKey !== row.rowKey))
                }
                className="flex h-form-field items-center justify-center text-text-black outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
              >
                <X size={20} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </ReceiptStepLayout>
  );
}

// 앱 안의 경로("/...")만 허용하고, 외부 주소("//evil.com")로는 보내지 않는다.
function readReturnPath(returnTo: string | null) {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return DEFAULT_RETURN_PATH;
}
