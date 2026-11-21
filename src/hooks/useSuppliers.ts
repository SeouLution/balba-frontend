import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listSuppliers, saveOrderDays, type SaveOrderDaysRequest } from "@/api/suppliers";

export function useSuppliers(storeId: string) {
  return useQuery({
    queryKey: ["suppliers", storeId],
    queryFn: () => listSuppliers(storeId),
  });
}

export function useSaveOrderDays(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveOrderDaysRequest) => saveOrderDays(storeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers", storeId] });
      // 주문 요일이 바뀌면 홈의 "오늘 할 발주"도 바뀐다.
      queryClient.invalidateQueries({ queryKey: ["home", storeId] });
    },
  });
}
