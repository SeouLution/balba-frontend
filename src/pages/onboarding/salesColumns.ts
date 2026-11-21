import type { SalesImport } from "@/api/salesImports";

export const salesColumns = [
  { key: "date", label: "날짜", editLabel: "날짜" },
  { key: "menuName", label: "메뉴 이름", editLabel: "메뉴 이름" },
  { key: "quantity", label: "판매 수량", editLabel: "수량" },
] as const;

export function formatSalesPeriod(period: SalesImport["period"]) {
  if (!period?.from || !period.to) return undefined;
  return period.from === period.to ? period.from : `${period.from} ~ ${period.to}`;
}
