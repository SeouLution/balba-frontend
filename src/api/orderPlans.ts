import { request } from "@/api/client";
import type { EventSummary } from "@/api/home";

export type IngredientUnit = "개" | "g";

export type OrderLine = {
  ingredient: { id: string; name: string };
  quantity: { value: number; unit: IngredientUnit };
  // 재료 단위 1개(1개 또는 1g)당 원. 단가를 모르면 null
  price: { unitPrice: number | null };
  // 근처 행사 때문에 더한 양(quantity와 같은 단위)
  eventDiff?: number;
  stock?: { value: number; unit: IngredientUnit } | null;
};

export type OrderPlanSupplier = {
  // null이면 거래처 미정(영수증 입고가 없는 재료). 이 묶음으로는 발주서를 만들 수 없다.
  supplier: { id: string; name: string } | null;
  lines: OrderLine[];
};

export type OrderPlan = {
  targetDate: string;
  events?: EventSummary[];
  usualTotal?: number | null;
  suppliers: OrderPlanSupplier[];
};

export function getOrderPlan(storeId: string, targetDate: string) {
  return request<OrderPlan>(`/v1/stores/${storeId}/order-plans/${targetDate}`);
}
