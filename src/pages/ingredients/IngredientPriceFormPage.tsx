import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import type { IngredientSummary } from "@/api/ingredients";
import { Button, DropdownOption, Select, TextField } from "@/components";
import { Loading } from "@/components/Loading";
import { useToast } from "@/components/toast/useToast";
import { useCreatePurchase, useIngredients } from "@/hooks/useIngredients";
import { useStoreId } from "@/hooks/useStoreId";

import { ReceiptStepLayout } from "./ReceiptStepLayout";

/**
 * 재료 금액 직접 입력(?mode=new) · 재료 수정(?mode=edit).
 * 진입: /ingredients/:ingredientId/price
 */
export function IngredientPriceFormPage() {
  const { ingredientId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeId = useStoreId();
  const ingredientsQuery = useIngredients(storeId);
  const isEdit = searchParams.get("mode") === "edit";
  const title = isEdit ? "재료 수정" : "금액 직접 입력";
  const goBack = () => navigate("/ingredients", { replace: true });

  if (ingredientsQuery.isPending) {
    return (
      <ReceiptStepLayout title={title} onBack={goBack}>
        <Loading />
      </ReceiptStepLayout>
    );
  }

  const ingredient = ingredientsQuery.data?.items.find((item) => item.id === ingredientId);
  if (!ingredient) {
    return (
      <ReceiptStepLayout title={title} onBack={goBack}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
          <p className="text-body-m text-text-gray-darker">재료 정보를 불러오지 못했어요.</p>
          <Button variant="secondary" onClick={goBack}>
            돌아가기
          </Button>
        </div>
      </ReceiptStepLayout>
    );
  }

  return (
    <PriceForm
      key={ingredient.id}
      storeId={storeId}
      title={title}
      ingredient={ingredient}
      onDone={goBack}
    />
  );
}

type PriceFormProps = {
  storeId: string;
  title: string;
  ingredient: IngredientSummary;
  onDone: () => void;
};

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function PriceForm({ storeId, title, ingredient, onDone }: PriceFormProps) {
  const showToast = useToast();
  const createPurchase = useCreatePurchase(storeId);
  const today = new Date();
  // 응답의 단가는 1개 · 1g당 값이라 산 금액(예: 20,000원)으로 되돌릴 수 없어 비워 둔다.
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  const formattedAmount = amount === "" ? "" : Number(amount).toLocaleString("ko-KR");
  const daysInMonth = new Date(year, month, 0).getDate();
  const years = [today.getFullYear() - 1, today.getFullYear()];
  const purchasedOn = toIsoDate(year, month, Math.min(day, daysInMonth));
  // 서버는 미래 입고일을 받지 않는다.
  const isFutureDate =
    purchasedOn > toIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const canSave = Number(quantity) > 0 && !isFutureDate && !createPurchase.isPending;

  function handleSave() {
    // TODO(api): 수기 입고는 수량 · 날짜만 받는다. 산 금액(단가)을 저장하는 API가 생기면 amount를 보낸다.
    createPurchase.mutate(
      { ingredientId: ingredient.id, purchasedOn, quantity: Number(quantity) },
      {
        onSuccess: () => {
          showToast("입고 정보를 저장했어요");
          onDone();
        },
        onError: () => showToast("저장하지 못했어요. 다시 눌러 주세요."),
      },
    );
  }

  return (
    <ReceiptStepLayout
      title={title}
      onBack={onDone}
      footer={
        <Button disabled={!canSave} onClick={handleSave} className="w-full">
          {createPurchase.isPending ? "저장하는 중…" : "저장"}
        </Button>
      }
    >
      {/* 재료 이름을 바꾸는 API가 없어 고를 재료를 보여주기만 한다. */}
      <TextField label="재료 이름" readOnly value={ingredient.name} />

      <TextField
        label="금액"
        inputMode="numeric"
        placeholder="금액을 입력해 주세요."
        value={formattedAmount}
        onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ""))}
        endAdornment={
          formattedAmount && (
            // 입력칸과 같은 여백 · 글자 크기로 숫자를 투명하게 한 번 더 써서, "원"이 숫자 바로 뒤에 오게 한다.
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center px-4 text-base whitespace-pre"
            >
              <span className="invisible">{formattedAmount}</span>
              <span className="text-form-ink">원</span>
            </span>
          )
        }
      />

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold text-form-ink">입고 날짜</legend>
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2">
          <Select
            label={<span className="sr-only">년</span>}
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="form-select-scroll pl-3 whitespace-nowrap"
          >
            {years.map((each) => (
              <DropdownOption key={each} value={each}>
                {each}년
              </DropdownOption>
            ))}
          </Select>
          <Select
            label={<span className="sr-only">월</span>}
            value={month}
            onChange={(event) => {
              const nextMonth = Number(event.target.value);
              setMonth(nextMonth);
              setDay((current) => Math.min(current, new Date(year, nextMonth, 0).getDate()));
            }}
            className="form-select-scroll pl-3 whitespace-nowrap"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((each) => (
              <DropdownOption key={each} value={each}>
                {each}월
              </DropdownOption>
            ))}
          </Select>
          <Select
            label={<span className="sr-only">일</span>}
            value={Math.min(day, daysInMonth)}
            onChange={(event) => setDay(Number(event.target.value))}
            className="form-select-scroll pl-3 whitespace-nowrap"
          >
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((each) => (
              <DropdownOption key={each} value={each}>
                {each}일
              </DropdownOption>
            ))}
          </Select>
        </div>
        {isFutureDate && (
          <p className="text-caption text-danger-subtle-text">오늘 이후 날짜는 고를 수 없어요.</p>
        )}
      </fieldset>

      <div className="grid grid-cols-[1fr_7rem] items-end gap-2">
        <TextField
          label="수량"
          inputMode="decimal"
          placeholder="재료의 수량을 입력해 주세요."
          value={quantity}
          onChange={(event) => setQuantity(event.target.value.replace(/[^0-9.]/g, ""))}
        />
        {/* 재료 단위(개 · g)는 서버가 정해서 고를 수 없다. */}
        <TextField label="단위" readOnly value={ingredient.unit} />
      </div>
    </ReceiptStepLayout>
  );
}
