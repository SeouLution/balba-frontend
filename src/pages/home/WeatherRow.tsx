import type { LucideIcon } from "lucide-react";

import type { HomeView, WeatherCondition, WeatherSummary } from "@/api/home";
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun } from "@/components/icons";
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
  weather: WeatherSummary;
};

export function WeatherRow({ view, weather }: WeatherRowProps) {
  const Icon = WEATHER_ICONS[weather.condition];
  const isChanged = Boolean(weather.changeText);

  return (
    <section
      className={cn(
        "rounded-lg bg-button-surface-1 px-4 py-3.5",
        // 밤사이 예보가 바뀌었으면 테두리로 강조한다.
        isChanged ? "border-3 border-border-primary" : "border border-border-grey",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 text-body-m text-text-gray">
          {view === "TOMORROW" ? "내일 날씨" : "오늘 날씨"}
        </span>
        <Icon size={22} strokeWidth={2} aria-hidden className="text-text-black" />
        <span className="text-number text-text-black">{Math.round(weather.temperatureC)}°C</span>
        <span className="text-label-s text-text-gray-darker">{weather.text}</span>
      </div>
      {weather.changeText && (
        <p className="mt-1 text-right text-caption text-text-gray-darker">{weather.changeText}</p>
      )}
    </section>
  );
}
