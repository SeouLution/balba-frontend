import { request } from "@/api/client";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// ESTIMATED 영수증 날짜로 추정 · CONFIRMED 사장님 확인 · UNKNOWN 영수증이 적어 모름
export type OrderDaysStatus = "ESTIMATED" | "CONFIRMED" | "UNKNOWN";

export type Supplier = {
  id: string;
  name: string;
  orderDays: DayOfWeek[];
  orderDaysStatus: OrderDaysStatus;
  receiptCount?: number;
};

export type SupplierList = {
  items: Supplier[];
};

export type SaveOrderDaysRequest = {
  items: {
    supplierId: string;
    orderDays: DayOfWeek[];
  }[];
};

export function listSuppliers(storeId: string) {
  return request<SupplierList>(`/v1/stores/${storeId}/suppliers`);
}

export function saveOrderDays(storeId: string, body: SaveOrderDaysRequest) {
  return request<void>(`/v1/stores/${storeId}/suppliers/order-days`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
