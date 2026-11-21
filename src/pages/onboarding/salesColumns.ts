import type { ColumnMapping, SalesColumn } from "./onboardingTypes";

export const salesColumns: { key: SalesColumn; label: string; editLabel: string }[] = [
  { key: "date", label: "날짜", editLabel: "날짜" },
  { key: "menuName", label: "메뉴 이름", editLabel: "메뉴 이름" },
  { key: "quantity", label: "판매 수량", editLabel: "수량" },
];

export const exampleHeaders = ["영업일자", "품목명", "판매량", "건수"];
export const exampleDetection: ColumnMapping = { date: "영업일자", menuName: "품목명" };
export const exampleSales = { period: "6주", menuCount: "24개", recordCount: "9,812건" };

export function isCompleteMapping(mapping: ColumnMapping) {
  return salesColumns.every(({ key }) => Boolean(mapping[key]));
}
