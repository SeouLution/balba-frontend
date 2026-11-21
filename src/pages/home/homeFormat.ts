import type { EventSummary, ForecastItem, HomeView } from "@/api/home";
import type { OrderLine } from "@/api/orderPlans";
import type { DayHours, DayOfWeek } from "@/pages/onboarding/onboardingTypes";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_CODES: DayOfWeek[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const KST_OFFSET_HOURS = 9;

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

/** "2026-11-14" → "11/14(토)" */
export function formatSlashMonthDayWeekday(date: string) {
  const parsed = parseDate(date);
  return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}(${WEEKDAYS[parsed.getUTCDay()]})`;
}

/** "2026-11-11" → 다음 날 요일 "목" */
export function formatNextDayWeekday(date: string) {
  const parsed = parseDate(date);
  return WEEKDAYS[(parsed.getUTCDay() + 1) % 7];
}

export type TodayClosing = {
  // "21시", "21시 30분"
  label: string;
  // "21:00"
  close: string;
  closeAt: number;
};

/**
 * "오늘"의 마감 시각. 휴무일이면 null.
 * 날짜는 기기 시계가 아니라 서버가 준 targetDate에서 구한다.
 * TOMORROW 뷰는 targetDate 전날, TODAY 뷰는 targetDate 그날이 오늘이다.
 */
export function findTodayClosing(
  view: HomeView,
  targetDate: string,
  businessHours: DayHours[],
): TodayClosing | null {
  const target = parseDate(targetDate);
  const daysBefore = view === "TOMORROW" ? 1 : 0;
  const today = new Date(target.getTime() - daysBefore * 24 * 60 * 60 * 1000);
  const hours = businessHours.find((item) => item.day === DAY_CODES[today.getUTCDay()]);
  if (!hours || hours.closed || !hours.open || !hours.close) return null;

  const [closeHour, closeMinute] = hours.close.split(":").map(Number);
  // 마감이 여는 시각보다 이르면 다음 날 새벽에 닫는다.
  const dayOffset = hours.close < hours.open ? 1 : 0;
  const closeAt = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() + dayOffset,
    closeHour - KST_OFFSET_HOURS,
    closeMinute,
  );
  const label = closeMinute === 0 ? `${closeHour}시` : `${closeHour}시 ${closeMinute}분`;
  return { label, close: hours.close, closeAt };
}

/** 남은 시간 → "3시간 남음", 1시간 미만은 "25분 남음". 지났으면 null */
export function formatRemaining(remainingMs: number) {
  if (remainingMs <= 0) return null;
  const minutes = Math.ceil(remainingMs / (60 * 1000));
  if (minutes < 60) return `${minutes}분 남음`;
  return `${Math.floor(minutes / 60)}시간 남음`;
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

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = KST_OFFSET_HOURS * 60 * 60 * 1000;

/** "2026-11-11"에서 days만큼 옮긴 날짜 */
export function shiftDate(date: string, days: number) {
  return new Date(parseDate(date).getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

/** 화면이 말하는 "오늘". TOMORROW 뷰는 targetDate 전날, TODAY 뷰는 targetDate 그날이다. */
export function todayOf(view: HomeView, targetDate: string) {
  return view === "TOMORROW" ? shiftDate(targetDate, -1) : targetDate;
}

export type WeekDay = {
  date: string;
  weekday: string;
  dayOfMonth: number;
};

/** startDate부터 7일 */
export function weekFrom(startDate: string): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const day = shiftDate(startDate, index);
    const parsed = parseDate(day);
    return { date: day, weekday: WEEKDAYS[parsed.getUTCDay()], dayOfMonth: parsed.getUTCDate() };
  });
}

/** 행사 기간이 그날(KST 0시~24시)과 겹치는지 */
export function isEventOnDate(event: EventSummary, date: string) {
  const dayStart = parseDate(date).getTime() - KST_OFFSET_MS;
  const dayEnd = dayStart + DAY_MS;
  return Date.parse(event.startAt) < dayEnd && Date.parse(event.endAt) > dayStart;
}

// 시각을 KST 기준 Date(UTC 필드로 읽음)로 바꾼다.
function toKst(epochMs: number) {
  return new Date(epochMs + KST_OFFSET_MS);
}

function formatKstDay(kst: Date) {
  return `${kst.getUTCMonth() + 1}/${kst.getUTCDate()}(${WEEKDAYS[kst.getUTCDay()]})`;
}

function formatKstTime(kst: Date) {
  return `${String(kst.getUTCHours()).padStart(2, "0")}:${String(kst.getUTCMinutes()).padStart(2, "0")}`;
}

/**
 * 하루 행사 → "11/14(토) 12:00 ~ 18:00"
 * 여러 날 행사 → "9/18(금) ~ 11/29(일)". 끝이 자정이면 그 전날까지로 본다.
 */
export function formatEventPeriod(event: EventSummary) {
  const start = toKst(Date.parse(event.startAt));
  const end = toKst(Date.parse(event.endAt));
  const lastDay = toKst(Date.parse(event.endAt) - 1);
  const isSameDay = start.toISOString().slice(0, 10) === lastDay.toISOString().slice(0, 10);

  if (isSameDay) return `${formatKstDay(start)} ${formatKstTime(start)} ~ ${formatKstTime(end)}`;
  return `${formatKstDay(start)} ~ ${formatKstDay(lastDay)}`;
}

/** 650 → "650m", 1961 → "2.0km" */
export function formatDistance(meters: number) {
  return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;
}

/** 20000 → "약 2만 명", 3000 → "약 3,000명" */
export function formatVisitors(count: number) {
  if (count < 10000) return `약 ${count.toLocaleString("ko-KR")}명`;
  const tenThousands = Math.round(count / 1000) / 10;
  return `약 ${tenThousands.toLocaleString("ko-KR")}만 명`;
}

/** 거래처 금액. 단가를 모르는 재료가 하나라도 있으면 null */
export function sumOrderLines(lines: OrderLine[]) {
  let total = 0;
  for (const line of lines) {
    if (line.price.unitPrice === null) return null;
    total += line.quantity.value * line.price.unitPrice;
  }
  return Math.round(total);
}

/** ["계란", "김", "단무지", ...] → "계란 · 김 외 4개" */
export function summarizeIngredientNames(lines: OrderLine[]) {
  const names = lines.map((line) => line.ingredient.name);
  const shown = names.slice(0, 2).join(" · ");
  const restCount = names.length - 2;
  return restCount > 0 ? `${shown} 외 ${restCount}개` : shown;
}
