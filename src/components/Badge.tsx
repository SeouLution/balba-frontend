import type { ReactNode } from "react";

import { ArrowDown, ArrowUp, SparkIcon, TriangleAlert } from "@/components/icons";
import { cn } from "@/utils/cn";

type BadgeType = "ai" | "warn" | "soft" | "up" | "down" | "outline";

type BadgeProps = {
  type?: BadgeType;
  className?: string;
  children: ReactNode;
};

const ICON_SIZE = 14;

export function Badge({ type = "soft", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1 rounded-pill pr-3 pl-2.5 text-caption whitespace-nowrap",
        type === "ai" && "bg-ai-badge-bg text-ai-badge-text",
        type === "warn" && "bg-danger-default text-text-white",
        (type === "soft" || type === "up" || type === "down") && "bg-button-subtle text-text-black",
        type === "outline" &&
          "border-[1.5px] border-border-primary bg-button-surface-1 text-text-black",
        className,
      )}
    >
      {type === "ai" && <SparkIcon size={ICON_SIZE} className="text-ai-spark" />}
      {type === "warn" && (
        <TriangleAlert size={ICON_SIZE} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      )}
      {type === "up" && (
        <ArrowUp size={ICON_SIZE} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      )}
      {type === "down" && (
        <ArrowDown size={ICON_SIZE} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      )}
      {children}
    </span>
  );
}
