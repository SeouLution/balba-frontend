import { request } from "@/api/client";

// 낱개로 세는 재료는 개, 그 밖은 g(액체는 1ml = 1g)
export type IngredientUnit = "개" | "g";

export type PriceInfo = {
  // 재료 단위 1개(1개 또는 1g)당 원. 소수일 수 있다. 단가가 없으면 null
  unitPrice: number | null;
};

export type IngredientSummary = {
  id: string;
  name: string;
  unit: IngredientUnit;
  price?: PriceInfo | null;
  supplier?: { id: string; name: string } | null;
};

export type IngredientList = {
  items: IngredientSummary[];
};

export function listIngredients(storeId: string) {
  return request<IngredientList>(`/v1/stores/${storeId}/ingredients`);
}

export type ManualPurchaseCreate = {
  ingredientId: string;
  // 입고일. 생략하면 오늘. 미래 날짜는 422
  purchasedOn?: string;
  // 재료 단위(개 · g) 수량
  quantity: number;
  // 1개 또는 1g당 원. 소수점 이하 최대 6자리
  unitPrice?: number | null;
};

/** 영수증 없는 재료 수기 입고 */
export function createPurchase(storeId: string, body: ManualPurchaseCreate) {
  return request<unknown>(`/v1/stores/${storeId}/purchases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
