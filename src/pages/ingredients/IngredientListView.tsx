import { useState } from "react";
import { useNavigate } from "react-router";

import type { IngredientSummary } from "@/api/ingredients";
import { Button } from "@/components";
import { Check, FilePen } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { useIngredients } from "@/hooks/useIngredients";

import { IngredientInfoSheet } from "./IngredientInfoSheet";
import { byKoreanName, formatUnitPrice } from "./ingredientFormat";

type IngredientListViewProps = {
  storeId: string;
  receiptIngredientNames: string[];
  onDismissReceiptResult: () => void;
};

/** 재료별: 재료마다 단가 · 단위. 영수증을 찍고 돌아오면 입력된 재료를 위에 모아 보여준다. */
export function IngredientListView({
  storeId,
  receiptIngredientNames,
  onDismissReceiptResult,
}: IngredientListViewProps) {
  const navigate = useNavigate();
  const ingredientsQuery = useIngredients(storeId);
  const [sheetIngredient, setSheetIngredient] = useState<IngredientSummary | null>(null);

  if (ingredientsQuery.isPending) return <Loading>재료를 불러오고 있어요.</Loading>;

  if (ingredientsQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-body-m text-text-gray-darker">재료를 불러오지 못했어요.</p>
        <Button variant="secondary" onClick={() => ingredientsQuery.refetch()}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  const ingredients = [...ingredientsQuery.data.items].sort(byKoreanName((item) => item.name));
  const receiptIngredients = ingredients.filter((item) =>
    receiptIngredientNames.includes(item.name),
  );

  return (
    <>
      {receiptIngredients.length > 0 && (
        <section className="rounded-lg bg-bg-page px-4 py-4">
          <span className="flex size-8 items-center justify-center rounded-pill bg-button-primary text-text-white">
            <Check size={18} strokeWidth={2.4} aria-hidden />
          </span>
          <h2 className="mt-3 text-label-s-b text-text-black">금액, 주문 날짜 정보가 입력됐어요</h2>
          <ul className="mt-2 divide-y divide-border-divider">
            {receiptIngredients.map((ingredient) => (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                onOpenSheet={() => setSheetIngredient(ingredient)}
              />
            ))}
          </ul>
          <Button variant="secondary" onClick={onDismissReceiptResult} className="mt-3 w-full">
            확인
          </Button>
        </section>
      )}

      <div className="flex items-center justify-between">
        <span className="text-label-s-b text-text-black">재료 {ingredients.length}개</span>
        <span className="text-caption text-text-gray">가나다 순</span>
      </div>

      {ingredients.length === 0 ? (
        <p className="py-12 text-center text-body-m text-text-gray-darker">
          아직 등록된 재료가 없어요.
        </p>
      ) : (
        <ul className="divide-y divide-border-divider">
          {ingredients.map((ingredient) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              onOpenSheet={() => setSheetIngredient(ingredient)}
            />
          ))}
        </ul>
      )}

      {sheetIngredient && (
        <IngredientInfoSheet
          ingredient={sheetIngredient}
          onClose={() => setSheetIngredient(null)}
          onDirectInput={() => navigate(`/ingredients/${sheetIngredient.id}/price`)}
          onTakeReceipt={() => navigate("/receipt?returnTo=/ingredients")}
        />
      )}
    </>
  );
}

// TODO(api): 디자인의 주문 날짜는 재료 응답에 없어서 뺐다.
function IngredientRow({
  ingredient,
  onOpenSheet,
}: {
  ingredient: IngredientSummary;
  onOpenSheet: () => void;
}) {
  const navigate = useNavigate();
  const unitPrice = formatUnitPrice(ingredient);

  return (
    <li className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => navigate(`/ingredients/${ingredient.id}/price?mode=edit`)}
        className="min-w-0 flex-1 py-3.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <p className="text-label-l text-text-black">{ingredient.name}</p>
        <p className="mt-0.5 flex items-center gap-2 text-caption text-text-gray-darker">
          <span>{unitPrice ?? "가격 정보 없음"}</span>
          <span aria-hidden className="h-3 w-px bg-border-grey" />
          <span>단위 {ingredient.unit}</span>
        </p>
      </button>
      <button
        type="button"
        aria-label={`${ingredient.name} 정보 입력`}
        onClick={onOpenSheet}
        className="flex size-11 shrink-0 items-center justify-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <FilePen size={22} aria-hidden />
      </button>
    </li>
  );
}
