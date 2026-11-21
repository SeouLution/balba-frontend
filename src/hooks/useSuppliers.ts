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
    },
  });
}
