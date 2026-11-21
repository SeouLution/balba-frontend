import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPurchase, listIngredients, type ManualPurchaseCreate } from "@/api/ingredients";

import { orderPlanQueryKey } from "./useOrderPlan";

export function useIngredients(storeId: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["ingredients", storeId],
    enabled,
    queryFn: () => listIngredients(storeId),
  });
}

/** 수기 입고. 재고가 바뀌므로 재료 · 홈 · 발주를 다시 받아온다. */
export function useCreatePurchase(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ManualPurchaseCreate) => createPurchase(storeId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ingredients", storeId] });
      void queryClient.invalidateQueries({ queryKey: ["home", storeId] });
      void queryClient.invalidateQueries({ queryKey: orderPlanQueryKey(storeId) });
    },
  });
}
