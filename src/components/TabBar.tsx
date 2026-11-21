import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

import { TabItem } from "@/components/TabItem";
import { cn } from "@/utils/cn";

export type TabBarItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type TabBarProps = {
  items: TabBarItem[];
  className?: string;
};

/** 현재 URL과 맞는 탭이 자동으로 선택돼요. */
export function TabBar({ items, className }: TabBarProps) {
  return (
    <nav
      aria-label="하단 탭"
      className={cn(
        "grid h-18 auto-cols-fr grid-flow-col border-t border-border-divider bg-button-surface-1",
        className,
      )}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20 focus-visible:ring-inset"
        >
          {({ isActive }) => <TabItem icon={item.icon} label={item.label} active={isActive} />}
        </NavLink>
      ))}
    </nav>
  );
}
