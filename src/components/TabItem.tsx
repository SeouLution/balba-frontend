import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

type TabItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

/** 하단 탭 한 칸. 현재 탭은 위쪽 막대 + 굵은 글자로 표시해요. */
export function TabItem({ icon: Icon, label, active = false }: TabItemProps) {
  return (
    <span className="relative flex h-18 w-full flex-col items-center gap-1 pt-3">
      {active && (
        <span className="absolute top-0 h-[3px] w-[49px] rounded-b-full bg-button-primary" />
      )}
      <Icon
        size={24}
        aria-hidden
        className={active ? "text-button-primary" : "text-border-primary"}
      />
      <span
        className={cn("text-small", active ? "font-bold text-text-black" : "text-text-gray-darker")}
      >
        {label}
      </span>
    </span>
  );
}
