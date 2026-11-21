import { request } from "@/api/client";

export type Quantity = {
  value: number;
  unit: string;
};

export type IngredientRef = {
  id: string;
  name: string;
};

export type ReceiptLine = {
  ingredient?: {
    id?: string | null;
    name?: string;
    isNew?: boolean;
  } | null;
  // 구매 단위로 환산한 입고량(계란 2판)
  quantity?: Quantity | null;
};

export type Receipt = {
  purchasedOn: string;
  lines: ReceiptLine[];
};

export type ReceiptSupplierGroup = {
  supplier: {
    id?: string | null;
    name?: string;
    isNew?: boolean;
  };
  receipts: Receipt[];
};

export type ReceiptQuestion = {
  id: string;
  rawName: string;
  candidate: IngredientRef;
};

export type ReceiptScanStatus = "PROCESSING" | "NEEDS_REVIEW" | "CONFIRMED";

export type ReceiptScan = {
  id: string;
  status: ReceiptScanStatus;
  // status가 NEEDS_REVIEW면 항상 있다.
  groups?: ReceiptSupplierGroup[];
  questions?: ReceiptQuestion[];
  removedDuplicateTexts?: string[];
};

export type ReceiptQuestionAnswer = {
  questionId: string;
  answer: "SAME" | "DIFFERENT";
};

export type ReceiptScanConfirmRequest = {
  answers?: ReceiptQuestionAnswer[];
};

export type CreateReceiptScanResponse = {
  id: string;
};

export const MAX_RECEIPT_IMAGES = 30;

export function createReceiptScan(storeId: string, images: Blob[]) {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append("images", image, `receipt-${index + 1}.jpg`);
  });

  return request<CreateReceiptScanResponse>(`/v1/stores/${storeId}/receipt-scans`, {
    method: "POST",
    body: formData,
  });
}

export function getReceiptScan(storeId: string, scanId: string) {
  return request<ReceiptScan>(`/v1/stores/${storeId}/receipt-scans/${scanId}`);
}

export function confirmReceiptScan(
  storeId: string,
  scanId: string,
  body: ReceiptScanConfirmRequest,
) {
  return request<void>(`/v1/stores/${storeId}/receipt-scans/${scanId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
