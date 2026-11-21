import { useNavigate } from "react-router";

import type { OrderPlanSummary } from "@/api/home";
import { Button } from "@/components";
import { Camera, TriangleAlert } from "@/components/icons";

import { formatNextDayWeekday, formatSlashMonthDay, formatWon } from "./homeFormat";

const cardClassName = "rounded-lg border border-border-grey bg-button-surface-1 px-5 py-5";

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
  targetDate: string;
  order: OrderPlanSummary;
};

/** 2.0-1 오늘 할 발주 (TOMORROW 뷰) */
export function OrderSummaryCard({ targetDate, order }: OrderSummaryCardProps) {
  const hasTotal = order.estimatedTotal !== null;

  // TODO: 2.8 발주 화면이 생기면 "발주 확인하기" 버튼으로 연결한다.
  return (
    <section className={cardClassName}>
      <h2 className="text-subtitle text-text-black">오늘 할 발주</h2>
      <p className="mt-1 text-body-s text-text-gray-darker">
        내일({formatSlashMonthDay(targetDate)}) 쓸 재료를 오늘 주문해요 · 거래처{" "}
        {order.supplierCount}곳
      </p>

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
    </section>
  );
}

/** 2.2 당일 아침에는 다음 발주를 마감 뒤에 알려준다는 안내만 보여준다. */
export function NextOrderNotice({ targetDate }: { targetDate: string }) {
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
    </section>
  );
}
