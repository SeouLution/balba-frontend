import type { ForecastItem, HomeView } from "@/api/home";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-11-11"을 기기 시간대와 상관없이 같은 날짜로 읽는다.
function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** "2026-11-11" → "11월 11일 수요일" */
export function formatMonthDayWeekday(date: string) {
  const parsed = parseDate(date);
  return `${parsed.getUTCMonth() + 1}월 ${parsed.getUTCDate()}일 ${WEEKDAYS[parsed.getUTCDay()]}요일`;
}

/** "2026-11-11" → "11/11" */
export function formatSlashMonthDay(date: string) {
  const parsed = parseDate(date);
  return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}`;
}

/** "2026-11-11" → 다음 날 요일 "목" */
export function formatNextDayWeekday(date: string) {
  const parsed = parseDate(date);
  return WEEKDAYS[(parsed.getUTCDay() + 1) % 7];
}

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatQuantity(value: number, unit: string) {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}${unit}`;
}

export type ChangeHint = {
  text: string;
  direction: "up" | "down" | null;
};

/**
 * 메뉴 이름 아래 한 줄.
 * 당일 아침에는 밤사이 바뀐 양을, 그 밖에는 평소(지난 4주 같은 요일) 대비를 보여준다.
 */
export function describeForecastChange(item: ForecastItem, view: HomeView): ChangeHint | null {
  if (view === "TODAY" && item.previousRecommended != null) {
    const diff = item.recommended - item.previousRecommended;
    if (diff !== 0) {
      const amount = formatQuantity(Math.abs(diff), item.unit);
      return diff > 0
        ? { text: `밤사이 예상 ${amount} 늘었어요`, direction: "up" }
        : { text: `밤사이 예상 ${amount} 줄었어요`, direction: "down" };
    }
  }

  const comparison = item.comparison;
  if (!comparison?.direction) return null;
  if (comparison.direction === "SIMILAR") return { text: "평소와 비슷", direction: null };

  const amount =
    comparison.diff != null ? `${formatQuantity(Math.abs(comparison.diff), item.unit)} ` : "";
  return comparison.direction === "MORE"
    ? { text: `평소보다 ${amount}많게`, direction: "up" }
    : { text: `평소보다 ${amount}적게`, direction: "down" };
}
