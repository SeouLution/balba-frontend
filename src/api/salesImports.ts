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
    preview?: { date?: string; menuName?: string; quantity?: number }[];
  } | null;
  period?: { from?: string; to?: string } | null;
  recordCount?: number | null;
};

function salesImportsPath(storeId: string) {
  return `/v1/stores/${encodeURIComponent(storeId)}/sales-imports`;
}

export function createSalesImport(storeId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request<{ id: string }>(salesImportsPath(storeId), {
    method: "POST",
    body: formData,
  });
}

export function getSalesImport(storeId: string, importId: string, signal?: AbortSignal) {
  return request<SalesImport>(`${salesImportsPath(storeId)}/${encodeURIComponent(importId)}`, {
    signal,
  });
}

/** 서버가 판별한 열 매핑을 그대로 승인한다(본문 없음, 202). */
export function confirmSalesImport(storeId: string, importId: string) {
  return request<void>(`${salesImportsPath(storeId)}/${encodeURIComponent(importId)}/confirm`, {
    method: "POST",
  });
}
