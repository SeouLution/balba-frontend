import { request } from "@/api/client";

// CORE 핵심(예측·발주 대상) · LATER 나중에 추가
export type IngredientStatus = "CORE" | "LATER";

export type PurchaseUnit = {
  label: string;
  // 구매 단위 1개에 든 사용 단위 수량(1판 = 30개). 모르면 null
  contentQuantity?: number | null;
};

export type PriceInfo = {
  // 구매 단위 1개당 원. 단가가 없으면 null
  unitPrice: number | null;
};

export type IngredientSummary = {
  id: string;
  name: string;
  status: IngredientStatus;
  usageUnit?: string;
  purchaseUnit?: PurchaseUnit | null;
  price?: PriceInfo | null;
  supplier?: { id: string; name: string } | null;
};

export type IngredientAlert = {
  id: string;
  type: "EXPIRY_IMMINENT" | "PRICE_CHANGED";
  title: string;
  message?: string;
};

export type IngredientList = {
  items: IngredientSummary[];
  counts: {
    core?: number;
    later?: number;
  };
  notices?: IngredientAlert[];
};

export function listIngredients(storeId: string, status?: IngredientStatus) {
  const query = status ? `?status=${status}` : "";
  return request<IngredientList>(`/v1/stores/${storeId}/ingredients${query}`);
}
