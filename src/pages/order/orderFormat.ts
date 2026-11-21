import type { EventSummary } from "@/api/home";
import type { OrderLine, OrderPlan } from "@/api/orderPlans";

const CROWD_LABELS = { NORMAL: "보통", BUSY: "붐빔", VERY_BUSY: "매우 붐빔" } as const;
const CROWD_ORDER = ["NORMAL", "BUSY", "VERY_BUSY"] as const;
// 행사 안내에서 이름을 늘어놓을 재료 수
const SHOWN_NAME_COUNT = 3;

function formatAmount(value: number, unit: string) {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}${unit}`;
}

/** 줄 이름 옆 배지. 행사가 없으면 null */
export function describeEventDiff(line: OrderLine, hasEvents: boolean) {
  const diff = line.eventDiff ?? 0;
  if (diff > 0) return { text: `행사 +${formatAmount(diff, line.quantity.unit)}`, isUp: true };
  // 행사가 있는데 더한 양이 0이면 "평소와 같음"
  if (hasEvents) return { text: "평소와 같음", isUp: false };
  return null;
}

/** "남은 약 45개" · "남은 것 없음". 모르면 null */
export function describeStock(line: OrderLine) {
  if (!line.stock) return null;
  // 서버는 음수 재고도 그대로 보낸다. 화면에서는 남은 게 없다고만 말한다.
  if (line.stock.value <= 0) return "남은 것 없음";
  return `남은 약 ${formatAmount(line.stock.value, line.stock.unit)}`;
}

/** "내일 근처 행사 · 인파 붐빔" */
export function describeEventTitle(events: EventSummary[]) {
  const levels = events.flatMap((event) => (event.crowdLevel ? [event.crowdLevel] : []));
  if (levels.length === 0) return "내일 근처 행사";
  const busiest = levels.reduce((top, level) =>
    CROWD_ORDER.indexOf(level) > CROWD_ORDER.indexOf(top) ? level : top,
  );
  return `내일 근처 행사 · 인파 ${CROWD_LABELS[busiest]}`;
}

// 마지막 글자에 받침이 있으면 "을", 없으면 "를"
function objectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return "을";
  return code % 28 === 0 ? "를" : "을";
}

/** "계란 · 김 · 떡을 평소보다 더 잡았어요" */
export function describeEventLines(plan: OrderPlan) {
  const names = plan.suppliers.flatMap((supplier) =>
    supplier.lines.filter((line) => (line.eventDiff ?? 0) > 0).map((line) => line.ingredient.name),
  );
  if (names.length === 0) return "발주량은 평소와 같아요";
  const shown = names.slice(0, SHOWN_NAME_COUNT).join(" · ");
  const restCount = names.length - SHOWN_NAME_COUNT;
  // "계란 · 김 · 떡 외 5개를"처럼 너무 길면 뒤는 개수로 줄인다.
  const subject = restCount > 0 ? `${shown} 외 ${restCount}개` : shown;
  return `${subject}${objectParticle(subject)} 평소보다 더 잡았어요`;
}

/** 21:00 → "밤 9시", 13:30 → "오후 1시 30분" */
export function formatSpokenTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour < 12 ? "오전" : hour < 18 ? "오후" : "밤";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}시${minute ? ` ${minute}분` : ""}`;
}
