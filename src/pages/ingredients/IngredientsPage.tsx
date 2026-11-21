import { useState } from "react";
import { useNavigate } from "react-router";

import type { IngredientStatus, IngredientSummary } from "@/api/ingredients";
import { Button } from "@/components";
import { Chip } from "@/components/Chip";
import { ChartColumn, ChevronRight, House, Box, Tag } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { TabBar, type TabBarItem } from "@/components/TabBar";
import { useIngredients } from "@/hooks/useIngredients";
import { useStoreId } from "@/hooks/useStoreId";

// TODO: 홈 · 할인 · 리포트 라우트가 생기면 경로를 맞춘다.
const TAB_BAR_ITEMS: TabBarItem[] = [
  { to: "/home", label: "홈", icon: House },
  { to: "/ingredients", label: "재료", icon: Box },
  { to: "/discount", label: "할인", icon: Tag },
  { to: "/report", label: "리포트", icon: ChartColumn },
];

/** 3.2 재료 탭 */
export function IngredientsPage() {
  const navigate = useNavigate();
  const storeId = useStoreId();
  const ingredientsQuery = useIngredients(storeId);
  const [selectedStatus, setSelectedStatus] = useState<IngredientStatus>("CORE");

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1">
      <header className="flex h-16 items-center px-5">
        <h1 className="text-label-l text-text-black">재료</h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-5 pb-6">
        <IngredientsContent
          query={ingredientsQuery}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          onTakeReceipt={() => navigate("/receipt?returnTo=/ingredients")}
        />
      </main>

      <TabBar items={TAB_BAR_ITEMS} className="sticky bottom-0" />
    </div>
  );
}

type IngredientsContentProps = {
  query: ReturnType<typeof useIngredients>;
  selectedStatus: IngredientStatus;
  onSelectStatus: (status: IngredientStatus) => void;
  onTakeReceipt: () => void;
};

function IngredientsContent({
  query,
  selectedStatus,
  onSelectStatus,
  onTakeReceipt,
}: IngredientsContentProps) {
  if (query.isPending) {
    return <Loading>재료를 불러오고 있어요.</Loading>;
  }

  if (query.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-body-m text-text-gray-darker">재료를 불러오지 못했어요.</p>
        <Button variant="secondary" onClick={() => query.refetch()}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  const { items, counts } = query.data;
  // 단가나 거래처가 빈 재료가 있으면 영수증을 찍으라고 안내한다.
  const hasMissingPurchaseInfo = items.some(
    (item) => item.price?.unitPrice == null || item.supplier == null,
  );
  const visibleItems = items.filter((item) => item.status === selectedStatus);

  return (
    <>
      {hasMissingPurchaseInfo && (
        <section className="rounded-lg bg-bg-page px-5 py-5">
          <p className="text-label-l text-text-black">거래처 영수증을 찍어주세요.</p>
          <p className="mt-1 text-body-s text-text-gray-darker">
            영수증을 찍어야 단가, 거래처가 채워져요
          </p>
          <Button variant="secondary" onClick={onTakeReceipt} className="mt-4 w-full">
            영수증 찍기
          </Button>
        </section>
      )}

      <div className="flex gap-2" role="group" aria-label="재료 구분">
        <Chip selected={selectedStatus === "CORE"} onClick={() => onSelectStatus("CORE")}>
          핵심 {counts.core ?? 0}
        </Chip>
        <Chip selected={selectedStatus === "LATER"} onClick={() => onSelectStatus("LATER")}>
          나중에 추가 {counts.later ?? 0}
        </Chip>
      </div>

      {visibleItems.length === 0 ? (
        <p className="py-12 text-center text-body-m text-text-gray-darker">
          {selectedStatus === "CORE" ? "핵심 재료가 없어요." : "나중에 추가할 재료가 없어요."}
        </p>
      ) : (
        <ul className="divide-y divide-border-divider">
          {visibleItems.map((item) => (
            <IngredientRow key={item.id} ingredient={item} />
          ))}
        </ul>
      )}
    </>
  );
}

// TODO(api): 재료 상세 화면이 생기면 행을 눌러 이동하게 한다.
function IngredientRow({ ingredient }: { ingredient: IngredientSummary }) {
  const purchaseUnitText = formatPurchaseUnit(ingredient);

  return (
    <li className="flex items-center gap-3 py-4">
      <div className="flex-1">
        <p className="text-label-l text-text-black">{ingredient.name}</p>
        {purchaseUnitText && (
          <p className="mt-1 text-body-s text-text-gray-darker">{purchaseUnitText}</p>
        )}
      </div>
      <ChevronRight size={20} aria-hidden className="text-border-primary" />
    </li>
  );
}

// 1판(30개) · 1봉 — 구매 단위 1개와, 알면 그 안에 든 사용 단위 수량
function formatPurchaseUnit({ purchaseUnit, usageUnit }: IngredientSummary) {
  if (!purchaseUnit) return null;
  const content =
    purchaseUnit.contentQuantity != null && usageUnit
      ? `(${purchaseUnit.contentQuantity}${usageUnit})`
      : "";
  return `1${purchaseUnit.label}${content}`;
}
