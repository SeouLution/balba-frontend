import { request } from "@/api/client";

// RECEIVED → PARSING → NEEDS_CONFIRMATION → APPLYING → COMPLETED
export type SalesImportStatus =
  "RECEIVED" | "PARSING" | "NEEDS_CONFIRMATION" | "APPLYING" | "COMPLETED";

export type SalesImport = {
  id: string;
  status: SalesImportStatus;
  detection?: {
    menuCount?: number;
    columnMapping: { date?: string; menuName?: string; quantity?: string };
  } | null;
  period?: { from?: string; to?: string } | null;
  recordCount?: number | null;
};

export function createSalesImport(storeId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request<{ id: string }>(`/v1/stores/${storeId}/sales-imports`, {
    method: "POST",
    body: formData,
  });
}

export function getSalesImport(storeId: string, importId: string) {
  return request<SalesImport>(`/v1/stores/${storeId}/sales-imports/${importId}`);
}

/** 서버가 판별한 열 매핑을 그대로 승인한다(본문 없음, 202). */
export function confirmSalesImport(storeId: string, importId: string) {
  return request<void>(`/v1/stores/${storeId}/sales-imports/${importId}/confirm`, {
    method: "POST",
  });
}
