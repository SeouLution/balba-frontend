import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/api/client";
import { confirmSalesImport, createSalesImport, getSalesImport } from "@/api/salesImports";

const SALES_IMPORT_POLLING_MS = 2000;

export function useCreateSalesImport(storeId: string) {
  return useMutation({
    mutationFn: (file: File) => createSalesImport(storeId, file),
    gcTime: 0,
  });
}

export function useSalesImport(storeId: string, importId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["salesImport", storeId, importId],
    queryFn:
      storeId && importId ? ({ signal }) => getSalesImport(storeId, importId, signal) : skipToken,
    enabled,
    retry: (failureCount, error) => !(error instanceof ApiError) && failureCount < 2,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return query.state.status !== "error" &&
        (status === "RECEIVED" || status === "PARSING" || status === "APPLYING")
        ? SALES_IMPORT_POLLING_MS
        : false;
    },
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
