import { request } from "@/api/client";
import type { DayHours } from "@/api/stores";

// TOMORROW 전날 밤(준비량 · 발주) · TODAY 당일 아침(오늘 미리 만들어둘 양)
// KST 20:00에 TOMORROW, 자정에 TODAY로 바뀐다. 프론트는 시계로 판단하지 않고 이 값을 따른다.
export type HomeView = "TOMORROW" | "TODAY";

export type WeatherCondition =
  "CLEAR" | "PARTLY_CLOUDY" | "CLOUDY" | "RAIN" | "SNOW" | "RAIN_SNOW" | "SHOWER";

export type WeatherSummary = {
  temperatureC: number;
  condition: WeatherCondition;
  text: string;
  // 밤사이 바뀌었으면 채워짐(강조 표시)
  changeText?: string | null;
};

export type EventSummary = {
  id: string;
  name: string;
  place?: string;
  distanceMeters: number;
  startAt: string;
  endAt: string;
  crowdLevel?: "NORMAL" | "BUSY" | "VERY_BUSY";
  expectedVisitors?: number | null;
  peakFrom?: string | null;
  peakTo?: string | null;
  detailUrl?: string | null;
};

// FIRST_FORECAST 첫 예측 준비됨(X로 닫은 것은 프론트가 기억) · OVERNIGHT_CHANGE 밤사이 변경
// EVENT_TODAY 오늘 행사 · DELIVERY_EXPECTED 어젯밤 발주 입고 예정 · LOW_STOCK 재고 부족
export type HomeBannerType =
  "FIRST_FORECAST" | "OVERNIGHT_CHANGE" | "EVENT_TODAY" | "DELIVERY_EXPECTED" | "LOW_STOCK";

export type HomeBanner = {
  type: HomeBannerType;
  title: string;
  message?: string | null;
};

export type ForecastItem = {
  menu: { id: string; name: string };
  unit: string;
  recommended: number;
  // 최종 준비량(사장님이 고쳤으면 그 값)
  planned: number;
  // 평소(지난 4주 같은 요일 평균) 대비
  comparison?: {
    direction?: "MORE" | "LESS" | "SIMILAR";
    diff?: number;
  };
  summaryText?: string;
  eventDiff?: number;
  // TODAY 뷰에서 전날 밤 추천량과 달라졌으면 그 이전 값
  previousRecommended?: number | null;
  // TODAY 뷰 — 지금까지 만든 양
  produced?: number | null;
};

export type OrderPlanSummary = {
  supplierCount: number;
  // 단가를 아는 재료가 없으면 null
  estimatedTotal: number | null;
};

export type Home = {
  storeName: string;
  // 월~일 영업시간. 휴무일은 day·closed만 온다.
  businessHours: DayHours[];
  view: HomeView;
  targetDate: string;
  tiles: {
    weather?: WeatherSummary;
    // 0건이면 행사 줄 자체를 숨긴다
    events?: EventSummary[];
  };
  banners: HomeBanner[];
  forecast: {
    items: ForecastItem[];
    totalMenuCount: number;
  };
  // TOMORROW 뷰에서만. 오늘 주문할 거래처가 없으면 null
  order?: OrderPlanSummary | null;
};

export type ForecastAdjustmentResult = {
  item: ForecastItem;
  order?: OrderPlanSummary | null;
};

export function getHome(storeId: string) {
  return request<Home>(`/v1/stores/${storeId}/home`);
}

export function adjustForecast(storeId: string, date: string, menuId: string, quantity: number) {
  return request<ForecastAdjustmentResult>(
    `/v1/stores/${storeId}/forecasts/${date}/menus/${menuId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    },
  );
}

export function setProduction(storeId: string, date: string, menuId: string, quantity: number) {
  return request<void>(`/v1/stores/${storeId}/production/${date}/menus/${menuId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}
