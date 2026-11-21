import { useEffect, useState, type ReactNode } from "react";

import type { EventSummary, HomeView } from "@/api/home";
import { Badge } from "@/components/Badge";
import { X } from "@/components/icons";
import { cn } from "@/utils/cn";

import {
  formatDistance,
  formatEventPeriod,
  formatVisitors,
  isEventOnDate,
  todayOf,
  weekFrom,
} from "./homeFormat";

type NearbyEventsSheetProps = {
  view: HomeView;
  targetDate: string;
  events: EventSummary[];
  onClose: () => void;
};

/** 2.7-1 오늘부터 7일 이내 열리는 행사(반경 3km) 바텀시트 */
export function NearbyEventsSheet({ view, targetDate, events, onClose }: NearbyEventsSheetProps) {
  const [selectedDate, setSelectedDate] = useState(targetDate);
  const today = todayOf(view, targetDate);
  const week = weekFrom(today);
  // TODO(api): 홈의 tiles.events는 targetDate와 겹치는 행사만 온다.
  //            그날과 겹치지 않는 다른 날 행사는 일주일 행사 API가 생겨야 보인다.
  const selectedEvents = events.filter((event) => isEventOnDate(event, selectedDate));
  const isToday = selectedDate === today;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    // 시트가 떠 있는 동안 뒤 화면이 스크롤되지 않게 한다.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-text-black/60"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="nearby-events-sheet-title"
        className="relative flex h-[calc(100dvh-5rem)] w-full max-w-md flex-col rounded-t-3xl bg-button-surface-1 pt-3"
      >
        <span aria-hidden className="mx-auto block h-1.5 w-11 rounded-pill bg-surface-gray-light" />
        <div className="mt-4 flex items-center gap-3 px-5">
          <h2 id="nearby-events-sheet-title" className="text-label-l font-semibold text-text-black">
            7일 이내 열리는 행사
          </h2>
          <span className="flex-1 text-body-s text-text-gray">3km 이내</span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
          >
            <X size={26} aria-hidden />
          </button>
        </div>

        <div role="group" aria-label="요일 선택" className="mt-4 grid grid-cols-7 gap-1 px-3">
          {week.map((day) => {
            const isSelected = day.date === selectedDate;
            const hasEvent = events.some((event) => isEventOnDate(event, day.date));

            return (
              <button
                key={day.date}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${day.dayOfMonth}일 ${day.weekday}요일${hasEvent ? ", 행사 있음" : ""}`}
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "mx-auto flex h-24 w-11 flex-col items-center gap-1.5 rounded-pill pt-3 outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20",
                  isSelected ? "bg-button-primary text-text-white" : "text-text-gray",
                )}
              >
                <span
                  className={cn(
                    "text-label-s",
                    isSelected ? "text-text-white" : "text-surface-gray-light",
                  )}
                >
                  {day.weekday}
                </span>
                <span className="text-label-s-b">{day.dayOfMonth}</span>
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-pill",
                    hasEvent ? (isSelected ? "bg-text-white" : "bg-button-primary") : "invisible",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-4 pb-8">
          {selectedEvents.length === 0 ? (
            <p className="flex h-full items-center justify-center text-body-s text-text-gray">
              {isToday ? "오늘은 근처 행사가 없어요" : "이 날은 근처 행사가 없어요"}
            </p>
          ) : (
            <>
              <p className="px-1 text-label-s text-text-gray">총 {selectedEvents.length}건</p>
              <ul className="mt-3 flex flex-col gap-3">
                {selectedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

const CROWD_BADGES = {
  VERY_BUSY: { type: "warn", label: "매우 붐빔" },
  BUSY: { type: "soft", label: "붐빔" },
  NORMAL: { type: "soft", label: "보통" },
} as const;

function EventCard({ event }: { event: EventSummary }) {
  const crowdBadge = event.crowdLevel ? CROWD_BADGES[event.crowdLevel] : null;
  const hasPeak = event.peakFrom && event.peakTo;

  return (
    <li className="rounded-lg border border-border-divider px-4 py-5">
      <h3 className="text-label-l font-semibold text-text-black">{event.name}</h3>
      <dl className="mt-3 flex flex-col gap-2.5 text-body-s">
        <EventRow label="장소">
          {event.place ? `${event.place} · ` : ""}
          {formatDistance(event.distanceMeters)}
        </EventRow>
        <EventRow label="시간">{formatEventPeriod(event)}</EventRow>
        {(crowdBadge || event.expectedVisitors != null) && (
          <EventRow label="예상 인파">
            <span className="inline-flex items-center gap-2">
              {crowdBadge && <Badge type={crowdBadge.type}>{crowdBadge.label}</Badge>}
              {event.expectedVisitors != null && formatVisitors(event.expectedVisitors)}
            </span>
          </EventRow>
        )}
        {hasPeak && (
          <EventRow label="붐비는 시간">
            {event.peakFrom} ~ {event.peakTo}
          </EventRow>
        )}
      </dl>
    </li>
  );
}

function EventRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-text-gray">{label}</dt>
      <dd className="min-w-0 text-right text-text-black">{children}</dd>
    </div>
  );
}
