import type { DayHours, DayOfWeek } from "@/api/stores";

export const WEEKDAYS: { day: DayOfWeek; label: string }[] = [
  { day: "MON", label: "월" },
  { day: "TUE", label: "화" },
  { day: "WED", label: "수" },
  { day: "THU", label: "목" },
  { day: "FRI", label: "금" },
  { day: "SAT", label: "토" },
  { day: "SUN", label: "일" },
];

export type TimeRange = { open: string; close: string };
export type HoursMode = "daily" | "weekday" | "individual";

export type HoursDraft = {
  mode: HoursMode;
  daily: TimeRange;
  weekday: TimeRange;
  weekend: TimeRange;
  individual: Record<DayOfWeek, TimeRange>;
  closed: DayOfWeek[];
};

const defaultRange = { open: "10:00", close: "21:00" };

export const initialHours: HoursDraft = {
  mode: "daily",
  daily: defaultRange,
  weekday: defaultRange,
  weekend: defaultRange,
  individual: {
    MON: defaultRange,
    TUE: defaultRange,
    WED: defaultRange,
    THU: defaultRange,
    FRI: defaultRange,
    SAT: defaultRange,
    SUN: defaultRange,
  },
  closed: ["SUN"],
};

function getRange(hours: HoursDraft, day: DayOfWeek) {
  if (hours.mode === "daily") return hours.daily;
  if (hours.mode === "individual") return hours.individual[day];
  return day === "SAT" || day === "SUN" ? hours.weekend : hours.weekday;
}

export function changeMode(hours: HoursDraft, mode: HoursMode): HoursDraft {
  if (hours.mode === mode) return hours;
  return {
    ...hours,
    mode,
    daily: getRange(hours, "MON"),
    weekday: getRange(hours, "MON"),
    weekend: getRange(hours, "SAT"),
    individual: {
      MON: getRange(hours, "MON"),
      TUE: getRange(hours, "TUE"),
      WED: getRange(hours, "WED"),
      THU: getRange(hours, "THU"),
      FRI: getRange(hours, "FRI"),
      SAT: getRange(hours, "SAT"),
      SUN: getRange(hours, "SUN"),
    },
  };
}

export function toBusinessHours(hours: HoursDraft): DayHours[] {
  return WEEKDAYS.map(({ day }) =>
    hours.closed.includes(day)
      ? { day, closed: true }
      : { day, closed: false, ...getRange(hours, day) },
  );
}

export function describeHours(hours: HoursDraft) {
  const days = toBusinessHours(hours);
  const closed = WEEKDAYS.filter(({ day }) => hours.closed.includes(day)).map(({ label }) => label);
  const groups: { labels: string[]; range: string }[] = [];

  for (const [index, day] of days.entries()) {
    if (day.closed) continue;
    const range = `${day.open} ~ ${day.close}`;
    const label = WEEKDAYS[index].label;
    const previous = groups.at(-1);
    if (previous?.range === range) previous.labels.push(label);
    else groups.push({ labels: [label], range });
  }

  const parts = groups.map(({ labels, range }) => {
    const label = hours.mode === "daily" ? "매일" : labels.join("·");
    return `${label} ${range}`;
  });

  if (closed.length) parts.push(`${closed.join("·")} 휴무`);
  return parts.join(" · ");
}

/**
 * 서버 영업시간 → 수정용 초안.
 * 여는 날의 시간이 모두 같으면 "매일 같아요", 다르면 "요일마다 달라요"로 연다.
 * 서버에 없는 요일은 쉬는 날로 본다.
 */
export function fromBusinessHours(days: DayHours[]): HoursDraft {
  const byDay = new Map(days.map((item) => [item.day, item]));
  const individual = { ...initialHours.individual };
  const closed: DayOfWeek[] = [];

  for (const { day } of WEEKDAYS) {
    const item = byDay.get(day);
    if (!item || item.closed || !item.open || !item.close) closed.push(day);
    else individual[day] = { open: item.open, close: item.close };
  }

  const openRanges = WEEKDAYS.filter(({ day }) => !closed.includes(day)).map(
    ({ day }) => individual[day],
  );
  const isSameEveryDay = openRanges.every(
    (range) => range.open === openRanges[0].open && range.close === openRanges[0].close,
  );
  const daily = openRanges[0] ?? defaultRange;

  return {
    mode: isSameEveryDay ? "daily" : "individual",
    daily,
    weekday: daily,
    weekend: daily,
    individual,
    closed,
  };
}
