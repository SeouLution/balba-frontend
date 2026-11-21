import { request } from "@/api/client";

export type StoreCategory = "BUNSIK" | "KOREAN_MEAL" | "GUKBAP" | "BANCHAN" | "BAKERY" | "OTHER";
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type DayHours = {
  day: DayOfWeek;
  closed: boolean;
  open?: string;
  close?: string;
};

type StoreCreate = {
  name: string;
  category: StoreCategory;
  address: { roadAddress: string };
  businessHours: DayHours[];
};

type Store = StoreCreate & { id: string };

export function createStore(body: StoreCreate) {
  return request<Store>("/v1/stores", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
