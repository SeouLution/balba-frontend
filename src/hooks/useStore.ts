import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getStore, updateStore, type StoreCreate } from "@/api/stores";

import { orderPlanQueryKey } from "./useOrderPlan";

function storeQueryKey(storeId: string) {
  return ["store", storeId] as const;
}

export function useStore(storeId: string) {
  return useQuery({
    queryKey: storeQueryKey(storeId),
    queryFn: () => getStore(storeId),
  });
}

export function useUpdateStore(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: StoreCreate) => updateStore(storeId, body),
    onSuccess: (store) => {
      queryClient.setQueryData(storeQueryKey(storeId), store);
      // 가게 이름 · 영업시간 · 예측이 바뀌므로 홈과 발주를 다시 받아온다.
      void queryClient.invalidateQueries({ queryKey: ["home", storeId] });
      void queryClient.invalidateQueries({ queryKey: orderPlanQueryKey(storeId) });
    },
  });
}
