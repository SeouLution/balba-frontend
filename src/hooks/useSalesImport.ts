import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { confirmSalesImport, createSalesImport, getSalesImport } from "@/api/salesImports";

const SALES_IMPORT_POLLING_MS = 2000;

export function useCreateSalesImport(storeId: string) {
  return useMutation({
    mutationFn: (file: File) => createSalesImport(storeId, file),
  });
}

/** 엑셀 반영은 비동기라 끝(COMPLETED)이 아니면 계속 다시 조회한다. */
export function useSalesImport(storeId: string, importId: string | null) {
  return useQuery({
    queryKey: ["salesImport", storeId, importId],
    queryFn: importId ? () => getSalesImport(storeId, importId) : skipToken,
    refetchInterval: (query) =>
      query.state.status !== "error" && query.state.data?.status !== "COMPLETED"
        ? SALES_IMPORT_POLLING_MS
        : false,
  });
}

export function useConfirmSalesImport(storeId: string, importId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmSalesImport(storeId, importId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesImport", storeId, importId] });
    },
  });
}
