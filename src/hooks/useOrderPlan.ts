import { useQuery } from "@tanstack/react-query";

import { getOrderPlan } from "@/api/orderPlans";

export function orderPlanQueryKey(storeId: string, targetDate?: string) {
  return targetDate
    ? (["orderPlan", storeId, targetDate] as const)
    : (["orderPlan", storeId] as const);
}

/** 오늘 주문할 거래처별 발주 제안. targetDate는 재료를 쓰는 영업일(홈의 targetDate). */
export function useOrderPlan(storeId: string, targetDate: string, enabled = true) {
  return useQuery({
    queryKey: orderPlanQueryKey(storeId, targetDate),
    queryFn: () => getOrderPlan(storeId, targetDate),
    enabled,
  });
}
