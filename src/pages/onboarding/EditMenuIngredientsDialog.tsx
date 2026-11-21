import { useId, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/Button";
import { DropdownOption } from "@/components/DropdownOption";
import { IconButton } from "@/components/IconButton";
import { Plus, X } from "@/components/icons";
import { Select } from "@/components/Select";
import { TextField } from "@/components/TextField";

import { OnboardingButton, OnboardingDialog } from "./OnboardingScreen";
import type { RecipeIngredient } from "./onboardingTypes";

type DraftIngredient = Omit<RecipeIngredient, "amount"> & { amount: string };

type EditMenuIngredientsDialogProps = {
  menuName: string;
  ingredients: RecipeIngredient[];
  onClose: () => void;
  onSave: (ingredients: RecipeIngredient[]) => void;
};

function isValidAmount(amount: string) {
  return amount.trim() !== "" && Number.isFinite(Number(amount)) && Number(amount) >= 0;
}

export function EditMenuIngredientsDialog({
  menuName,
  ingredients,
  onClose,
  onSave,
}: EditMenuIngredientsDialogProps) {
  const idPrefix = useId();
  const nextId = useRef(0);
  const [rows, setRows] = useState<DraftIngredient[]>(() =>
    ingredients.map((item) => ({ ...item, amount: String(item.amount) })),
  );
  const [newRowId, setNewRowId] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  function addIngredient() {
    const id = `${idPrefix}-${nextId.current++}`;
    setRows((current) => [...current, { id, name: "", amount: "", unit: "개" }]);
    setNewRowId(id);
  }

  function updateIngredient(id: string, changes: Partial<Omit<DraftIngredient, "id">>) {
    setRows((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (rows.some(({ name, amount }) => !name.trim() || !isValidAmount(amount))) return;

    onSave(rows.map((item) => ({ ...item, name: item.name.trim(), amount: Number(item.amount) })));
  }

  return (
    <OnboardingDialog title={`‘${menuName}’ 재료 수정`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="grid gap-4 pt-3">
        <Button
          variant="plain"
          onClick={addIngredient}
          className="flex min-h-14 items-center gap-3 rounded-md border border-dashed border-border-primary bg-bg-page px-5 text-left text-label-l font-semibold text-text-black hover:bg-button-subtle"
        >
          <Plus size={20} className="text-button-primary" aria-hidden />
          재료 추가하기
        </Button>
        {rows.length > 0 && (
          <ul className="grid gap-3">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-start gap-3 md:grid-cols-[minmax(0,1fr)_6.25rem_6.25rem_2.75rem]"
              >
                <div className="col-span-3 md:col-span-1">
                  <TextField
                    label="재료이름"
                    value={row.name}
                    autoFocus={newRowId === row.id}
                    aria-required="true"
                    error={submitted && !row.name.trim() ? "재료이름을 입력해 주세요." : undefined}
                    className="rounded-sm border-border-primary px-3.5 text-label-l text-text-black"
                    onChange={(event) =>
                      updateIngredient(row.id, { name: event.currentTarget.value })
                    }
                  />
                </div>
                <TextField
                  label="1인분 양"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  aria-required="true"
                  value={row.amount}
                  error={
                    submitted && !isValidAmount(row.amount)
                      ? "0 이상의 양을 입력해 주세요."
                      : undefined
                  }
                  className="[appearance:textfield] rounded-sm border-border-primary px-3.5 text-label-l text-text-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(event) =>
                    updateIngredient(row.id, { amount: event.currentTarget.value })
                  }
                />
                <Select
                  label="단위"
                  value={row.unit}
                  indicatorClassName="right-2.5 text-text-black"
                  className="rounded-sm border-border-grey pr-8 pl-3.5 text-label-l text-text-black"
                  onChange={(event) => {
                    const unit = event.currentTarget.value;
                    if (unit === "개" || unit === "g") updateIngredient(row.id, { unit });
                  }}
                >
                  <DropdownOption value="개">개</DropdownOption>
                  <DropdownOption value="g">g</DropdownOption>
                </Select>
                <IconButton
                  variant="plain"
                  aria-label={`${index + 1}번째 재료 삭제`}
                  icon={<X size={22} />}
                  className="mt-7.5 grid h-form-field w-11 place-items-center rounded-sm text-text-black hover:bg-bg-hover"
                  onClick={() => setRows((current) => current.filter(({ id }) => id !== row.id))}
                />
              </li>
            ))}
          </ul>
        )}
        <OnboardingButton type="submit" className="w-full">
          저장
        </OnboardingButton>
      </form>
    </OnboardingDialog>
  );
}
