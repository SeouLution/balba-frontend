import { useNavigate } from "react-router";

import type { Home } from "@/api/home";
import type { OrderPlan } from "@/api/orderPlans";
import { AppTabBar } from "@/components/AppTabBar";
import { Button } from "@/components";
import { FileIcon } from "@/components/icons";
import { Loading } from "@/components/Loading";
import { useHome } from "@/hooks/useHome";
import { useOrderPlan } from "@/hooks/useOrderPlan";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { useStoreId } from "@/hooks/useStoreId";
import { formatSlashMonthDayWeekday, formatWon, shiftDate } from "@/pages/home/homeFormat";
import { NextOrderNotice } from "@/pages/home/OrderCards";

import { EventNotice } from "./EventNotice";
import { OrderHeader } from "./OrderHeader";

const ORDER_STEPS = ["재료 수량을 확인하고 고쳐요", "발주서가 만들어져요", "복사로 주문하면 끝"];

/** 3.8 발주 탭 — 내일 발주(전날 밤) 또는 미리 보기 안내(당일 낮) · 지난 발주서 */
export function OrderPage() {
  const storeId = useStoreId();
  const navigate = useNavigate();
  const homeQuery = useHome(storeId);
  const home = homeQuery.data;
  const isTomorrow = home?.view === "TOMORROW";
  // 발주는 전날 밤(TOMORROW 뷰)에만 한다.
  const orderPlanQuery = useOrderPlan(storeId, home?.targetDate ?? "", isTomorrow);
  const plan = orderPlanQuery.data;
  const hasPlan = isTomorrow && plan !== undefined && plan.suppliers.length > 0;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-button-surface-1">
      <OrderHeader title="발주" onBack={() => navigate("/home")} />
      <main className="flex flex-1 flex-col gap-6 px-5 pb-8">
        {homeQuery.isPending || (isTomorrow && orderPlanQuery.isPending) ? (
          <Loading>발주를 불러오고 있어요.</Loading>
        ) : (
          <>
            {hasPlan && home && <TomorrowOrderCard home={home} plan={plan} />}
            {home?.view === "TODAY" && <PreviewNotice targetDate={home.targetDate} />}
            <PastPurchaseOrders storeId={storeId} />
            {hasPlan && <OrderStepsCard />}
          </>
        )}
      </main>
      <AppTabBar />
    </div>
  );
}

function TomorrowOrderCard({ home, plan }: { home: Home; plan: OrderPlan }) {
  const navigate = useNavigate();
  const estimatedTotal = home.order?.estimatedTotal ?? null;

  return (
    <section className="rounded-lg border border-border-divider px-5 py-6">
      <h2 className="flex items-baseline gap-2">
        <span className="text-label-l font-semibold text-button-primary">내일 발주</span>
        <span className="text-body-s text-text-gray-darker">
          {formatSlashMonthDayWeekday(home.targetDate)}
        </span>
      </h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-body-s text-text-gray-darker">예상 금액</span>
        <span className="text-number text-text-black">
          {estimatedTotal !== null ? `약 ${formatWon(estimatedTotal)}` : "금액 미정"}
        </span>
      </div>
      <EventNotice plan={plan} className="mt-4" />
      <Button onClick={() => navigate("/order/new")} className="mt-4 w-full">
        새 발주서 만들기
      </Button>
    </section>
  );
}

/** 당일 낮에는 내일 발주를 마감 뒤에 알려주되, 지금 미리 볼 수 있게 한다. */
function PreviewNotice({ targetDate }: { targetDate: string }) {
  const navigate = useNavigate();
  const tomorrow = shiftDate(targetDate, 1);

  return (
    <NextOrderNotice
      targetDate={targetDate}
      action={
        <Button
          variant="secondary"
          onClick={() => navigate(`/order/new?date=${tomorrow}`)}
          className="mt-4 w-full"
        >
          지금 보기
        </Button>
      }
    />
  );
}

function PastPurchaseOrders({ storeId }: { storeId: string }) {
  const purchaseOrdersQuery = usePurchaseOrders(storeId);
  const items = purchaseOrdersQuery.data?.items ?? [];

  return (
    <section>
      <h2 className="text-label-l font-semibold text-text-gray-darker">지난 발주서</h2>
      {purchaseOrdersQuery.isPending ? (
        <p className="mt-4 text-body-s text-text-gray">지난 발주서를 불러오고 있어요.</p>
      ) : purchaseOrdersQuery.isError ? (
        <p className="mt-4 text-body-s text-danger-subtle-text">지난 발주서를 불러오지 못했어요.</p>
      ) : items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-lg bg-bg-page px-5 py-10 text-center">
          <span className="grid size-13 place-items-center rounded-md bg-button-surface-1 text-border-primary">
            <FileIcon size={26} aria-hidden />
          </span>
          <p className="mt-4 text-label-l font-semibold text-button-primary">
            아직 만든 발주서가 없어요
          </p>
          <p className="mt-2 text-body-s text-text-gray-darker">
            발주서를 보내면
            <br />
            날짜 · 거래처 · 금액이 여기에 쌓여요
          </p>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-border-divider px-5 py-5">
              {/* 발주는 재료를 쓰는 날(targetDate) 전날에 한다. */}
              <h3 className="text-label-l font-semibold text-text-black">
                {formatSlashMonthDayWeekday(shiftDate(item.targetDate, -1))} 발주
              </h3>
              {/* TODO(api): 지난 발주서 목록에 재료 줄이 없어 거래처 이름만 보여준다. */}
              <p className="mt-2 text-body-s text-text-gray">{item.supplier.name}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border-divider pt-4">
                <span className="text-label-l font-semibold text-text-black">총 발주 금액</span>
                <span className="text-label-l font-semibold text-text-black">
                  {item.totalAmount != null ? formatWon(item.totalAmount) : "금액 미정"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderStepsCard() {
  return (
    <section className="rounded-lg border border-border-grey px-5 py-6">
      <h2 className="text-label-l text-text-gray-darker">발주는 이렇게 해요</h2>
      <ol className="mt-4 flex flex-col gap-3">
        {ORDER_STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-body-m text-text-black">
            <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-button-primary text-label-s text-text-white">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
