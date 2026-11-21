import type { IngredientSummary } from "@/api/ingredients";

/**
 * 재료 단위 1개당 단가. API는 1개 또는 1g당 원을 소수로 줄 수 있다.
 * 100원 이상은 반올림, 그보다 작으면 소수 첫째 자리까지 보여준다(1g당 2.5원).
 */
export function formatUnitPrice(ingredient: IngredientSummary) {
  const unitPrice = ingredient.price?.unitPrice;
  if (unitPrice == null) return null;
  const amount = unitPrice.toLocaleString("ko-KR", {
    maximumFractionDigits: unitPrice >= 100 ? 0 : 1,
  });
  return `1${ingredient.unit}당 ${amount}원`;
}

export function formatQuantity(value: number, unit: string) {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}${unit}`;
}

/** 가나다 순 */
export function byKoreanName<T>(nameOf: (item: T) => string) {
  return (a: T, b: T) => nameOf(a).localeCompare(nameOf(b), "ko");
}
