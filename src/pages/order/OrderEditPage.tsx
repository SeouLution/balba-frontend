import { useState } from "react";
import { AppPanel } from "@/components/AppPanel";
import { useNavigate, useSearchParams } from "react-router";

import type { OrderLine, OrderPlan, OrderPlanSupplier } from "@/api/orderPlans";
import { Badge } from "@/components/Badge";
import { Button } from "@/components";
import { Loading } from "@/components/Loading";
import { useHome } from "@/hooks/useHome";
import { useOrderPlan } from "@/hooks/useOrderPlan";
import { useCreatePurchaseOrders } from "@/hooks/usePurchaseOrders";
import { useStoreId } from "@/hooks/useStoreId";
import { findTodayClosing } from "@/pages/home/homeFormat";

import { EventNotice } from "./EventNotice";
import { OrderHeader } from "./OrderHeader";
import { describeEventDiff, describeStock, formatSpokenTime } from "./orderFormat";
import type { OrderShareState } from "./OrderSharePage";

// 거래처 미정 묶음(supplier: null)을 가리키는 키
const UNASSIGNED_KEY = "unassigned";

// 같은 재료를 여러 거래처에서 살 수 있어서 거래처와 함께 구분한다.
function lineKey(supplier: OrderPlanSupplier["supplier"], ingredientId: string) {
  return `${supplier?.id ?? UNASSIGNED_KEY}:${ingredientId}`;
}

/**
 * 2.8 내일 발주 — 재료 수량을 고치고 거래처별 발주서를 만든다.
 * ?date=로 날짜를 받으면(당일 낮 "지금 보기") 그 날짜의 발주를 미리 본다.
 */
export function OrderEditPage() {
  const storeId = useStoreId();
  const homeQuery = useHome(storeId);
  const home = homeQuery.data;
  const [searchParams] = useSearchParams();
  const targetDate = searchParams.get("date") ?? home?.targetDate ?? "";
  const orderPlanQuery = useOrderPlan(storeId, targetDate, targetDate !== "");
  const closing = home ? findTodayClosing(home.view, home.targetDate, home.businessHours) : null;

  return (
    <AppPanel>
      <OrderHeader
        title="내일 발주"
        subtitle={closing ? `오늘 ${formatSpokenTime(closing.close)}까지` : undefined}
      />
      {homeQuery.isError || orderPlanQuery.isError ? (
        <p className="px-5 py-20 text-center text-body-m text-text-gray-darker">
          발주 제안을 불러오지 못했어요.
        </p>
      ) : !home || !orderPlanQuery.data ? (
        <Loading>발주 제안을 불러오고 있어요.</Loading>
      ) : (
        <OrderEditForm storeId={storeId} plan={orderPlanQuery.data} />
      )}
    </AppPanel>
  );
}

function OrderEditForm({ storeId, plan }: { storeId: string; plan: OrderPlan }) {
  const navigate = useNavigate();
  const createPurchaseOrders = useCreatePurchaseOrders(storeId);
  const hasEvents = (plan.events ?? []).length > 0;
  const hasOrderableSupplier = plan.suppliers.some(({ supplier }) => supplier !== null);
  // 입력 중인 수량. 처음에는 서버가 제안한 양으로 채운다.
  const [drafts, setDrafts] = useState(() => {
    const initial: Record<string, string> = {};
    for (const { supplier, lines } of plan.suppliers) {
      for (const line of lines) {
        initial[lineKey(supplier, line.ingredient.id)] = String(line.quantity.value);
      }
    }
    return initial;
  });

  if (plan.suppliers.length === 0) {
    return (
      <p className="px-5 py-20 text-center text-body-m text-text-gray-darker">
        오늘 주문할 거래처가 없어요.
      </p>
    );
  }

  function submit() {
    createPurchaseOrders.mutate(
      {
        targetDate: plan.targetDate,
        // 거래처 미정 묶음은 발주서를 만들 수 없어서 뺀다.
        suppliers: plan.suppliers.flatMap(({ supplier, lines }) =>
          supplier
            ? [
                {
                  supplierId: supplier.id,
                  lines: lines.map((line) => ({
                    ingredientId: line.ingredient.id,
                    quantity: Number(drafts[lineKey(supplier, line.ingredient.id)] || 0),
                  })),
                },
              ]
            : [],
        ),
      },
      {
        onSuccess: (result) => {
          const state: OrderShareState = { purchaseOrders: result.items };
          // 공유 화면에서 뒤로 가도 수정 화면으로 돌아오지 않게 바꿔 끼운다.
          navigate("/order/share", { replace: true, state });
        },
      },
    );
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 px-5 pb-6 md:px-8">
        <EventNotice plan={plan} />
        {plan.suppliers.map(({ supplier, lines }) => (
          <section
            key={supplier?.id ?? UNASSIGNED_KEY}
            aria-label={supplier?.name ?? "거래처 미정"}
            className="rounded-lg border border-border-divider px-4 py-2"
          >
            {supplier ? (
              <p className="pt-3 text-caption text-text-gray">{supplier.name}</p>
            ) : (
              <p className="pt-3 text-caption text-text-gray">
                거래처 미정 · 영수증을 찍으면 이 재료도 발주할 수 있어요
              </p>
            )}
            <ul className="divide-y divide-border-divider">
              {lines.map((line) => {
                const key = lineKey(supplier, line.ingredient.id);
                return (
                  <OrderLineRow
                    key={key}
                    line={line}
                    hasEvents={hasEvents}
                    value={drafts[key]}
                    // 거래처 미정 재료는 발주서에 들어가지 않아 수량을 고칠 수 없다.
                    disabled={!supplier}
                    onChange={(value) => setDrafts((prev) => ({ ...prev, [key]: value }))}
                  />
                );
              })}
            </ul>
          </section>
        ))}
      </main>
      <div className="sticky bottom-0 bg-button-surface-1 px-5 pt-2 pb-6 md:grid md:justify-items-end md:rounded-b-lg md:px-8 md:[&>button]:max-w-80 md:[&>p]:justify-self-stretch">
        {createPurchaseOrders.isError && (
          <p className="pb-2 text-center text-caption text-danger-subtle-text">
            발주서를 만들지 못했어요. 다시 눌러 주세요.
          </p>
        )}
        <Button
          onClick={submit}
          disabled={!hasOrderableSupplier || createPurchaseOrders.isPending}
          className="w-full"
        >
          {createPurchaseOrders.isPending ? "발주서를 만들고 있어요" : "발주서 만들기"}
        </Button>
      </div>
    </>
  );
}

type OrderLineRowProps = {
  line: OrderLine;
  hasEvents: boolean;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

function OrderLineRow({ line, hasEvents, value, disabled, onChange }: OrderLineRowProps) {
  const eventBadge = describeEventDiff(line, hasEvents);
  const stockText = describeStock(line);

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-label-l font-semibold text-button-primary">
          {line.ingredient.name}
        </span>
        {eventBadge && <Badge type={eventBadge.isUp ? "up" : "soft"}>{eventBadge.text}</Badge>}
      </div>
      {stockText && <p className="mt-1 text-body-s text-text-gray">{stockText}</p>}
      <div className="mt-3 flex gap-3">
        <input
          type="text"
          inputMode="decimal"
          aria-label={`${line.ingredient.name} 발주량`}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9.]/g, ""))}
          className="h-14 min-w-0 flex-1 rounded-sm border border-border-primary bg-button-surface-1 px-4 text-label-l text-text-black tabular-nums outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20 disabled:border-border-grey disabled:text-text-gray"
        />
        {/* 재료 단위는 서버가 정한다(개 · g). 고를 수 없어서 글자로만 보여준다. */}
        <span className="flex h-14 w-28 shrink-0 items-center rounded-sm border border-border-grey px-4 text-label-l text-text-black">
          {line.quantity.unit}
        </span>
      </div>
    </li>
  );
}
