import { useEffect, useState } from "react";

import type { HomeView } from "@/api/home";
import type { DayHours } from "@/pages/onboarding/onboardingTypes";
import { Clock } from "@/components/icons";

import { findTodayClosing, formatRemaining } from "./homeFormat";

const TICK_MS = 60 * 1000;

type DeadlineChipProps = {
  view: HomeView;
  targetDate: string;
  businessHours: DayHours[];
};

/** "오늘 21시 마감 | 3시간 남음". 오늘이 휴무면 그리지 않는다. */
export function DeadlineChip({ view, targetDate, businessHours }: DeadlineChipProps) {
  const now = useNow();
  const closing = findTodayClosing(view, targetDate, businessHours);
  if (!closing) return null;

  // TODO(api): 응답에 서버 시각(now)이 없어 기기 시계로 남은 시간을 센다.
  //            백엔드 DEMO_NOW로 시각을 고정한 시연에서는 실제 남은 시간과 어긋난다.
  const remaining = formatRemaining(closing.closeAt - now);

  return (
    <p className="inline-flex items-center gap-3 self-start rounded-pill bg-surface-white-dark px-4 py-2 text-label-s text-text-gray-darker">
      <Clock size={20} strokeWidth={1.75} aria-hidden />
      <span>오늘 {closing.label} 마감</span>
      {remaining && (
        <>
          <span aria-hidden className="h-4 w-px bg-border-primary" />
          <span>{remaining}</span>
        </>
      )}
    </p>
  );
}

function useNow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return now;
}
