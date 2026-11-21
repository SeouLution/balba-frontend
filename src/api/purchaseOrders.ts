import { request } from "@/api/client";

export type PurchaseOrderSummary = {
  id: string;
  targetDate: string;
  supplier: { id: string; name: string };
  totalAmount?: number | null;
};

export type PurchaseOrder = {
  id: string;
  targetDate: string;
  supplier: {
    id?: string;
    name?: string;
    phone?: string | null;
    phoneConfirmed?: boolean;
    phoneSourceText?: string | null;
  };
  // 거래처에 그대로 보낼 문구(줄바꿈 포함)
  messageText: string;
};

export type PurchaseOrderCreate = {
  targetDate: string;
  suppliers: {
    supplierId: string;
    lines: { ingredientId: string; quantity: number }[];
  }[];
};

export type SendChannel = "SMS" | "KAKAOTALK" | "COPY";

export function listPurchaseOrders(storeId: string) {
  return request<{ items: PurchaseOrderSummary[] }>(`/v1/stores/${storeId}/purchase-orders`);
}

export function createPurchaseOrders(storeId: string, body: PurchaseOrderCreate) {
  return request<{ items: PurchaseOrder[] }>(`/v1/stores/${storeId}/purchase-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** 전송은 기기에서 하고 서버는 보낸 방법만 기록한다. */
export function recordSent(storeId: string, purchaseOrderId: string, channel: SendChannel) {
  return request<void>(`/v1/stores/${storeId}/purchase-orders/${purchaseOrderId}/send-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel }),
  });
}
