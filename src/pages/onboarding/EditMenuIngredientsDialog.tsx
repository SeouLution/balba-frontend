import { useRef, useState, type FormEvent } from "react";

import type { Recipe } from "@/api/recipes";
import { Button } from "@/components/Button";
import { DropdownOption } from "@/components/DropdownOption";
import { IconButton } from "@/components/IconButton";
import { Plus, X } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { Select } from "@/components/Select";
import { TextField } from "@/components/TextField";
import { useIngredients } from "@/hooks/useIngredients";
import { useSaveRecipes } from "@/hooks/useRecipes";

import { OnboardingButton, OnboardingDialog, OnboardingError } from "./OnboardingScreen";

type DraftIngredient = { rowId: number; ingredientId: string; amount: string };

type EditMenuIngredientsDialogProps = {
  storeId: string;
  recipe: Recipe;
  onClose: () => void;
};

export function EditMenuIngredientsDialog({
  storeId,
  recipe,
  onClose,
}: EditMenuIngredientsDialogProps) {
  const ingredients = useIngredients(storeId, { enabled: Boolean(storeId) });
  const save = useSaveRecipes(storeId);
  const nextRowId = useRef(recipe.items.length);
  const [rows, setRows] = useState<DraftIngredient[]>(() =>
    recipe.items.map(({ ingredient, quantity }, rowId) => ({
      rowId,
      ingredientId: ingredient.id,
      amount: String(quantity.value),
    })),
  );
  const catalog = new Map(
    recipe.items.map(({ ingredient, quantity }) => [
      ingredient.id,
      { ...ingredient, unit: quantity.unit },
    ]),
  );
  ingredients.data?.items.forEach((ingredient) => catalog.set(ingredient.id, ingredient));
  const optionList = [...catalog.values()];
  const selectedIds = new Set(rows.map(({ ingredientId }) => ingredientId));
  const valid =
    selectedIds.size === rows.length &&
    rows.every(
      ({ ingredientId, amount }) =>
        catalog.has(ingredientId) &&
        amount.trim() !== "" &&
        Number.isFinite(Number(amount)) &&
        Number(amount) >= 0,
    );

  function addIngredient() {
    const rowId = nextRowId.current++;
    setRows((current) => [...current, { rowId, ingredientId: "", amount: "" }]);
  }

  function updateIngredient(rowId: number, changes: Partial<Omit<DraftIngredient, "rowId">>) {
    setRows((current) =>
      current.map((row) => (row.rowId === rowId ? { ...row, ...changes } : row)),
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || save.isPending) return;
    save.mutate(
      {
        items: [
          {
            menuId: recipe.menu.id,
            items: rows.map(({ ingredientId, amount }) => ({
              ingredientId,
              quantity: Number(amount),
            })),
          },
        ],
      },
      { onSuccess: onClose },
    );
  }

  // TODO(api): 재료 신규 등록과 단위 변경 계약이 없어 이미 등록된 재료와 해당 단위를 사용한다.
  return (
    <OnboardingDialog
      title={`‘${recipe.menu.name}’ 재료 수정`}
      onClose={() => {
        if (!save.isPending) onClose();
      }}
    >
      <form onSubmit={submit} noValidate className="grid gap-4 pt-3">
        {ingredients.isPending && <Loading className="py-4">재료 목록을 불러오고 있어요.</Loading>}
        {ingredients.isError && (
          <>
            <OnboardingError>추가할 재료 목록을 불러오지 못했어요.</OnboardingError>
            <Button
              variant="secondary"
              disabled={ingredients.isFetching}
              onClick={() => void ingredients.refetch()}
            >
              재료 목록 다시 불러오기
            </Button>
          </>
        )}
        <Button
          variant="plain"
          onClick={addIngredient}
          disabled={save.isPending || !optionList.some(({ id }) => !selectedIds.has(id))}
          className="flex min-h-14 items-center gap-3 rounded-md border border-dashed border-border-primary bg-bg-page px-5 text-left text-label-l font-semibold text-text-black hover:bg-button-subtle disabled:opacity-50"
        >
          <Plus size={20} className="text-button-primary" aria-hidden />
          재료 추가하기
        </Button>
        {rows.length > 0 && (
          <ul className="grid gap-3">
            {rows.map((row, index) => (
              <li
                key={row.rowId}
                className="grid grid-cols-[minmax(0,1fr)_3.5rem_2.75rem] items-end gap-3 md:grid-cols-[minmax(0,1fr)_6.25rem_3.5rem_2.75rem]"
              >
                <div className="col-span-3 md:col-span-1">
                  <Select
                    label="재료 이름"
                    placeholder="재료 선택"
                    value={row.ingredientId}
                    disabled={save.isPending}
                    onChange={(event) =>
                      updateIngredient(row.rowId, { ingredientId: event.currentTarget.value })
                    }
                  >
                    {optionList
                      .filter(({ id }) => id === row.ingredientId || !selectedIds.has(id))
                      .map(({ id, name }) => (
                        <DropdownOption key={id} value={id}>
                          {name}
                        </DropdownOption>
                      ))}
                  </Select>
                </div>
                <TextField
                  label="1인분 양"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  required
                  disabled={save.isPending}
                  value={row.amount}
                  className="rounded-sm border-border-primary px-3.5 text-label-l"
                  onChange={(event) =>
                    updateIngredient(row.rowId, { amount: event.currentTarget.value })
                  }
                />
                <span className="grid h-form-field place-items-center text-label-l">
                  {catalog.get(row.ingredientId)?.unit ?? "—"}
                </span>
                <IconButton
                  variant="plain"
                  aria-label={`${index + 1}번째 재료 삭제`}
                  icon={<X size={22} />}
                  disabled={save.isPending}
                  className="grid h-form-field w-11 place-items-center rounded-sm text-text-black hover:bg-bg-hover"
                  onClick={() =>
                    setRows((current) => current.filter(({ rowId }) => rowId !== row.rowId))
                  }
                />
              </li>
            ))}
          </ul>
        )}
        {save.isError && (
          <OnboardingError>재료를 저장하지 못했어요. 다시 시도해 주세요.</OnboardingError>
        )}
        <OnboardingButton type="submit" className="w-full" disabled={!valid || save.isPending}>
          {save.isPending ? "저장 중…" : "저장"}
        </OnboardingButton>
      </form>
    </OnboardingDialog>
  );
}
