import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import type { OrderPlanSummary } from "@/api/home";
import { Button } from "@/components";
import { Camera, ChevronRight, TriangleAlert } from "@/components/icons";
import { useOrderPlan } from "@/hooks/useOrderPlan";

import {
  formatNextDayWeekday,
  formatSlashMonthDay,
  formatWon,
  sumOrderLines,
  summarizeIngredientNames,
} from "./homeFormat";

// 거래처 미정 묶음(supplier: null)의 React key
const UNASSIGNED_KEY = "unassigned";

const cardClassName =
  "rounded-lg border border-border-grey bg-button-surface-1 px-5 py-5 desktop:p-6";

/** 단가가 비어 있을 때 영수증을 찍게 안내한다. */
export function ReceiptPromptCard() {
  const navigate = useNavigate();

  return (
    <section className={cardClassName}>
      <span className="flex size-12 items-center justify-center rounded-md bg-button-primary text-bg-page">
        <Camera size={24} aria-hidden />
      </span>
      <h2 className="mt-4 text-body-l-b text-text-black">영수증을 찍어 재료 단가를 채워주세요</h2>
      <p className="mt-1 text-body-s text-text-gray-darker">
        단가가 있어야 오늘 밤 발주 금액을 계산할 수 있어요.
        <br />
        최근 거래처 영수증 한 장이면 시작돼요
      </p>
      <Button
        variant="secondary"
        onClick={() => navigate("/receipt?returnTo=/home")}
        className="mt-4 w-full"
      >
        영수증 사진 찍기
      </Button>
    </section>
  );
}

type OrderSummaryCardProps = {
  storeId: string;
  targetDate: string;
  order: OrderPlanSummary;
};

/** 2.0-1 오늘 할 발주 (TOMORROW 뷰). 거래처별 금액은 발주 제안에서 수량 × 단가로 더한다. */
export function OrderSummaryCard({ storeId, targetDate, order }: OrderSummaryCardProps) {
  const navigate = useNavigate();
  const orderPlanQuery = useOrderPlan(storeId, targetDate);
  const hasTotal = order.estimatedTotal !== null;
  const goToOrder = () => navigate("/order");

  return (
    <section className={cardClassName}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-subtitle text-text-black 2xl:text-title">오늘 할 발주</h2>
        <button
          type="button"
          aria-label="발주 화면으로 가기"
          onClick={goToOrder}
          className="flex size-10 items-center justify-center rounded-sm text-text-gray outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>
      <p className="mt-1 text-body-s text-text-gray-darker">
        내일({formatSlashMonthDay(targetDate)}) 쓸 재료를 오늘 주문해요
      </p>

      <SupplierList query={orderPlanQuery} />

      {!hasTotal && (
        <p className="mt-4 flex items-center gap-1.5 text-label-s text-danger-subtle-text">
          <TriangleAlert size={18} strokeWidth={2.2} aria-hidden />
          영수증을 찍으면 거래처별 금액이 나와요
        </p>
      )}

      <div className="mt-3 flex items-center justify-between rounded-md bg-bg-page px-4 py-3.5">
        <span className="text-body-s text-text-gray-darker">총 주문금액</span>
        <span className="text-label-l text-text-black">
          {order.estimatedTotal !== null ? formatWon(order.estimatedTotal) : "금액 미정"}
        </span>
      </div>

      <Button onClick={goToOrder} className="mt-4 w-full">
        발주 확인하기
      </Button>
    </section>
  );
}

function SupplierList({ query }: { query: ReturnType<typeof useOrderPlan> }) {
  if (query.isPending) {
    return <p className="mt-4 text-body-s text-text-gray">거래처별 발주를 불러오고 있어요.</p>;
  }
  if (query.isError) {
    return (
      <p className="mt-4 text-body-s text-danger-subtle-text">거래처별 발주를 불러오지 못했어요.</p>
    );
  }
  if (query.data.suppliers.length === 0) return null;

  return (
    // 거래처가 많으면 카드 안에서 스크롤한다.
    <ul className="mt-3 max-h-80 divide-y divide-border-divider overflow-y-auto pr-3">
      {query.data.suppliers.map(({ supplier, lines }) => {
        const amount = sumOrderLines(lines);

        return (
          <li key={supplier?.id ?? UNASSIGNED_KEY} className="flex items-center gap-3 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-label-l font-semibold text-text-black">
                {supplier?.name ?? "거래처 미정"}
              </p>
              <p className="mt-1 truncate text-body-s text-text-gray">
                {summarizeIngredientNames(lines)}
              </p>
            </div>
            <span className="shrink-0 text-label-l text-text-gray">
              {amount !== null ? formatWon(amount) : "금액 미정"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** 2.2 당일 아침에는 다음 발주를 마감 뒤에 알려준다는 안내만 보여준다. */
export function NextOrderNotice({
  targetDate,
  action,
}: {
  targetDate: string;
  action?: ReactNode;
}) {
  return (
    <section className={cardClassName}>
      <h2 className="text-body-l-b text-text-black">
        내일 ({formatNextDayWeekday(targetDate)}) 발주는
        <br />
        마감 이후에 알려드려요.
      </h2>
      <p className="mt-2 text-body-s text-text-gray-darker">
        입력해주신 POS 판매 기록과 날씨, 주변 행사 영향을 조합해서 발주량을 알려드릴게요.
      </p>
      {action}
    </section>
  );
}
