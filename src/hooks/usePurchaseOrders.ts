import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPurchaseOrders,
  listPurchaseOrders,
  recordSent,
  type PurchaseOrderCreate,
  type SendChannel,
} from "@/api/purchaseOrders";

function purchaseOrdersQueryKey(storeId: string) {
  return ["purchaseOrders", storeId] as const;
}

/** 3.8 지난 발주서(최신순) */
export function usePurchaseOrders(storeId: string) {
  return useQuery({
    queryKey: purchaseOrdersQueryKey(storeId),
    queryFn: () => listPurchaseOrders(storeId),
  });
}

/** 2.8 "발주서 만들기" */
export function useCreatePurchaseOrders(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PurchaseOrderCreate) => createPurchaseOrders(storeId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseOrdersQueryKey(storeId) }),
  });
}

/** 3.1 복사 · 문자 · 카톡으로 보낸 방법 기록 */
export function useRecordSent(storeId: string) {
  return useMutation({
    mutationFn: ({ purchaseOrderId, channel }: { purchaseOrderId: string; channel: SendChannel }) =>
      recordSent(storeId, purchaseOrderId, channel),
  });
}
