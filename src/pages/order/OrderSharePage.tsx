import { Navigate, useLocation, useNavigate } from "react-router";

import type { PurchaseOrder } from "@/api/purchaseOrders";
import { Button } from "@/components";
import { useToast } from "@/components/toast/useToast";
import { useHome } from "@/hooks/useHome";
import { useRecordSent } from "@/hooks/usePurchaseOrders";
import { useStoreId } from "@/hooks/useStoreId";
import { findTodayClosing, formatSlashMonthDayWeekday, shiftDate } from "@/pages/home/homeFormat";

import { OrderHeader } from "./OrderHeader";
import { formatSpokenTime } from "./orderFormat";

export type OrderShareState = {
  purchaseOrders: PurchaseOrder[];
};

/** 3.1 발주서 공유 — 거래처별 문구를 복사해서 보낸다. */
export function OrderSharePage() {
  const storeId = useStoreId();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OrderShareState | null;
  const home = useHome(storeId).data;
  const closing = home ? findTodayClosing(home.view, home.targetDate, home.businessHours) : null;

  // 새로고침 등으로 만든 발주서를 잃으면 발주 탭으로 돌려보낸다.
  if (!state) return <Navigate to="/order" replace />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1">
      <OrderHeader
        title="발주서 공유"
        subtitle={closing ? `오늘 ${formatSpokenTime(closing.close)}까지` : undefined}
        onBack={() => navigate("/order", { replace: true })}
      />
      <main className="flex flex-1 flex-col gap-4 px-5 pb-6">
        <h2 className="text-subtitle text-button-primary">
          발주서를 참고하여
          <br />
          주문 완료 후 다시 돌아와 주세요.
        </h2>
        {state.purchaseOrders.map((purchaseOrder) => (
          <PurchaseOrderCard
            key={purchaseOrder.id}
            storeId={storeId}
            purchaseOrder={purchaseOrder}
          />
        ))}
      </main>
      <div className="sticky bottom-0 bg-button-surface-1 px-5 pt-2 pb-6">
        <Button onClick={() => navigate("/order", { replace: true })} className="w-full">
          주문 완료
        </Button>
      </div>
    </div>
  );
}

function PurchaseOrderCard({
  storeId,
  purchaseOrder,
}: {
  storeId: string;
  purchaseOrder: PurchaseOrder;
}) {
  const showToast = useToast();
  const recordSent = useRecordSent(storeId);
  // 첫 줄은 "[가게] 11/11(수) 발주" 머리말이라 제목으로 대신하고 나머지 줄만 보여준다.
  const bodyLines = purchaseOrder.messageText.split("\n").slice(1);

  async function copy() {
    try {
      await navigator.clipboard.writeText(purchaseOrder.messageText);
    } catch {
      showToast("복사하지 못했어요. 다시 눌러 주세요.");
      return;
    }
    showToast("발주서를 복사했어요");
    recordSent.mutate({ purchaseOrderId: purchaseOrder.id, channel: "COPY" });
  }

  return (
    <section className="rounded-lg border border-border-divider px-5 py-6">
      {purchaseOrder.supplier.name && (
        <p className="text-caption text-text-gray">{purchaseOrder.supplier.name}</p>
      )}
      {/* 발주는 재료를 쓰는 날(targetDate) 전날에 한다. */}
      <h3 className="text-label-l font-semibold text-text-black">
        {formatSlashMonthDayWeekday(shiftDate(purchaseOrder.targetDate, -1))} 발주
      </h3>
      <p className="mt-3 text-body-s whitespace-pre-line text-text-gray">{bodyLines.join("\n")}</p>
      <Button variant="secondary" onClick={copy} className="mt-5 w-full">
        복사하기
      </Button>
    </section>
  );
}
