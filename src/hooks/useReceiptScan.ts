import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  confirmReceiptScan,
  createReceiptScan,
  getReceiptScan,
  type ReceiptScanConfirmRequest,
} from "@/api/receiptScans";

const RECEIPT_SCAN_POLLING_MS = 2000;

export function useCreateReceiptScan(storeId: string) {
  return useMutation({
    mutationFn: (images: Blob[]) => createReceiptScan(storeId, images),
  });
}

// 영수증 읽기는 비동기라 PROCESSING인 동안 계속 다시 조회한다.
export function useReceiptScan(storeId: string, scanId: string | null) {
  return useQuery({
    queryKey: ["receiptScan", storeId, scanId],
    queryFn: scanId ? () => getReceiptScan(storeId, scanId) : skipToken,
    refetchInterval: (query) =>
      query.state.data?.status === "PROCESSING" ? RECEIPT_SCAN_POLLING_MS : false,
  });
}

export function useConfirmReceiptScan(storeId: string, scanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ReceiptScanConfirmRequest) => confirmReceiptScan(storeId, scanId, body),
    // 거래처 생성 · 단가 기록 · 입고가 한 번에 처리되므로 관련 목록을 새로 받는다.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receiptScan", storeId, scanId] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", storeId] });
      queryClient.invalidateQueries({ queryKey: ["ingredients", storeId] });
    },
  });
}
