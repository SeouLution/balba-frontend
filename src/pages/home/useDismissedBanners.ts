import { useState } from "react";

import type { HomeBannerType } from "@/api/home";

function storageKey(storeId: string, targetDate: string) {
  return `home-dismissed-banners:${storeId}:${targetDate}`;
}

function readDismissed(key: string): HomeBannerType[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(saved) ? (saved as HomeBannerType[]) : [];
  } catch {
    return [];
  }
}

/** 홈 배너 X로 닫은 것을 기억한다(백엔드는 저장하지 않음). 날짜가 바뀌면 다시 보인다. */
export function useDismissedBanners(storeId: string, targetDate: string) {
  const key = storageKey(storeId, targetDate);
  const [dismissed, setDismissed] = useState(() => readDismissed(key));

  function dismiss(type: HomeBannerType) {
    const next = [...new Set([...dismissed, type])];
    setDismissed(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // 저장이 안 되는 환경이면 이번 화면에서만 숨긴다.
    }
  }

  return { isDismissed: (type: HomeBannerType) => dismissed.includes(type), dismiss };
}
