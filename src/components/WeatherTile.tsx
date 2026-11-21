import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/Badge";
import { cn } from "@/utils/cn";

type WeatherTileProps = {
  icon: LucideIcon;
  temperature: string;
  caption: string;
  changed?: boolean;
  className?: string;
};

/** 날씨 한 칸. 예보가 바뀌면 두꺼운 테두리와 "바뀜" 배지를 보여줘요. */
export function WeatherTile({
  icon: Icon,
  temperature,
  caption,
  changed = false,
  className,
}: WeatherTileProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-1.5 rounded-lg bg-button-surface-1 px-4 pt-4 pb-3",
        changed ? "border-3 border-border-primary" : "border border-border-grey",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-text-black">
        <Icon size={20} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
        <span className="text-number">{temperature}</span>
      </div>
      <span className="text-label-s text-text-gray-darker">{caption}</span>
      {changed && (
        <Badge type="up" className="absolute -top-3.5 right-3">
          바뀜
        </Badge>
      )}
    </div>
  );
}
