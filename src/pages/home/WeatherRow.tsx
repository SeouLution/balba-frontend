import type { LucideIcon } from "lucide-react";

import type { HomeView, WeatherCondition, WeatherSummary } from "@/api/home";
import { ChevronRight, Cloud, CloudRain, CloudSnow, CloudSun, Sun } from "@/components/icons";
import { cn } from "@/utils/cn";

const WEATHER_ICONS: Record<WeatherCondition, LucideIcon> = {
  CLEAR: Sun,
  PARTLY_CLOUDY: CloudSun,
  CLOUDY: Cloud,
  RAIN: CloudRain,
  SHOWER: CloudRain,
  SNOW: CloudSnow,
  RAIN_SNOW: CloudSnow,
};

type WeatherRowProps = {
  view: HomeView;
  weather?: WeatherSummary;
  eventCount: number;
  onEventsClick: () => void;
};

/** 날씨 줄과 "7일 이내 열리는 행사" 줄. 둘 다 없으면 그리지 않는다. */
export function WeatherRow({ view, weather, eventCount, onEventsClick }: WeatherRowProps) {
  if (!weather && eventCount === 0) return null;
  const isChanged = Boolean(weather?.changeText);

  return (
    <section
      className={cn(
        "divide-y divide-border-divider rounded-lg bg-button-surface-1 px-4 desktop:max-w-72",
        // 밤사이 예보가 바뀌었으면 테두리로 강조한다.
        isChanged ? "border-3 border-border-primary" : "border border-border-grey",
      )}
    >
      {weather && <WeatherLine view={view} weather={weather} />}
      {/* 행사가 0건이면 행사 줄 자체를 숨긴다. */}
      {eventCount > 0 && (
        <button
          type="button"
          onClick={onEventsClick}
          className="flex w-full items-center gap-2 py-3.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20 desktop:py-2.5"
        >
          <span className="flex-1 text-body-m text-text-gray desktop:text-caption">
            7일 이내 열리는 행사
          </span>
          <span className="text-label-l text-text-black desktop:text-label-s-b">
            {eventCount}건
          </span>
          <ChevronRight size={22} aria-hidden className="text-text-gray" />
        </button>
      )}
    </section>
  );
}

function WeatherLine({ view, weather }: { view: HomeView; weather: WeatherSummary }) {
  const Icon = WEATHER_ICONS[weather.condition];

  return (
    <div className="py-3.5 desktop:py-3">
      <div className="flex items-center gap-2 desktop:grid desktop:justify-items-end desktop:gap-1">
        <span className="flex-1 text-body-m text-text-gray desktop:text-caption">
          {view === "TOMORROW" ? "내일 날씨" : "오늘 날씨"}
        </span>
        <div className="flex items-center gap-2">
          <Icon size={22} strokeWidth={2} aria-hidden className="shrink-0 text-text-black" />
          <span className="text-number whitespace-nowrap text-text-black">
            {Math.round(weather.temperatureC)}°C
          </span>
          <span className="text-label-s text-text-gray-darker">{weather.text}</span>
        </div>
      </div>
      {weather.changeText && (
        <p className="mt-1 text-right text-caption text-text-gray-darker">{weather.changeText}</p>
      )}
    </div>
  );
}
