import { request } from "@/api/client";

export type StoreCategory = "BUNSIK" | "KOREAN_MEAL" | "GUKBAP" | "BANCHAN" | "BAKERY" | "OTHER";
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type DayHours = {
  day: DayOfWeek;
  closed: boolean;
  open?: string;
  close?: string;
};

export type StoreCreate = {
  name: string;
  category: StoreCategory;
  address: { roadAddress: string };
  businessHours: DayHours[];
};

export type Store = StoreCreate & { id: string };

export function createStore(body: StoreCreate) {
  return request<Store>("/v1/stores", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** 수정 화면의 초기값 */
export function getStore(storeId: string) {
  return request<Store>(`/v1/stores/${storeId}`);
}

/** 가게 정보를 통째로 바꾼다. 주소 · 영업시간이 바뀌면 서버가 오늘 · 내일 예측을 다시 계산한다. */
export function updateStore(storeId: string, body: StoreCreate) {
  return request<Store>(`/v1/stores/${storeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
