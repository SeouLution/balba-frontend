import { useLocation, useNavigate, useSearchParams } from "react-router";

import { AppTabBar } from "@/components/AppTabBar";
import { Plus } from "@/components/icons";
import { useStoreId } from "@/hooks/useStoreId";
import { cn } from "@/utils/cn";

import { IngredientListView } from "./IngredientListView";
import { MenuRecipeListView } from "./MenuRecipeListView";
import type { ReceiptFlowResult } from "./ReceiptFlowPage";

type IngredientsTab = "menus" | "ingredients";

/** 3.2 재료 탭 — 메뉴별(레시피) · 재료별(단가) */
export function IngredientsPage() {
  const storeId = useStoreId();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // 수정 화면에서 돌아와도 보던 탭이 유지되도록 주소에 둔다. 기본은 재료별.
  const tab: IngredientsTab = searchParams.get("tab") === "menus" ? "menus" : "ingredients";
  const receiptResult = location.state as ReceiptFlowResult | null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1">
      <header className="flex h-16 items-center justify-between px-5">
        <h1 className="text-label-l text-text-black">재료</h1>
        {tab === "menus" && (
          <button
            type="button"
            onClick={() => navigate("/ingredients/menus/new")}
            className="inline-flex h-12 items-center gap-1 rounded-sm border border-border-grey bg-button-surface-1 px-4 text-label-l text-text-black outline-none hover:bg-bg-hover focus-visible:ring-4 focus-visible:ring-button-primary/20 active:bg-button-subtle"
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden />
            메뉴 추가
          </button>
        )}
      </header>

      <main className="flex flex-1 flex-col gap-4 px-5 pb-6">
        <div role="tablist" aria-label="재료 보기" className="grid grid-cols-2 gap-2">
          <TabButton
            selected={tab === "menus"}
            onClick={() => setSearchParams({ tab: "menus" }, { replace: true })}
          >
            메뉴별
          </TabButton>
          <TabButton
            selected={tab === "ingredients"}
            onClick={() => setSearchParams({}, { replace: true })}
          >
            재료별
          </TabButton>
        </div>

        {tab === "menus" ? (
          <MenuRecipeListView storeId={storeId} />
        ) : (
          <IngredientListView
            storeId={storeId}
            receiptIngredientNames={receiptResult?.receiptIngredientNames ?? []}
            // 완료 카드를 닫으면 넘겨받은 값을 지워 새로고침 · 뒤로 가기에 다시 뜨지 않게 한다.
            onDismissReceiptResult={() => navigate(location.pathname, { replace: true })}
          />
        )}
      </main>

      <AppTabBar />
    </div>
  );
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "h-11 rounded-pill text-label-s-b outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20",
        selected ? "bg-button-primary text-text-white" : "text-text-gray",
      )}
    >
      {children}
    </button>
  );
}
