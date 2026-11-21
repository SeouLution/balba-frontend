import { Box, House, Tag } from "@/components/icons";
import { TabBar, type TabBarItem } from "@/components/TabBar";
import { cn } from "@/utils/cn";

const APP_TAB_ITEMS: TabBarItem[] = [
  { to: "/home", label: "홈", icon: House },
  { to: "/ingredients", label: "재료", icon: Box },
  { to: "/order", label: "발주", icon: Tag },
];

/** 앱 하단 탭(홈 · 재료 · 발주). 화면 아래에 붙어 있어요. */
export function AppTabBar({ className }: { className?: string }) {
  return <TabBar items={APP_TAB_ITEMS} className={cn("sticky bottom-0", className)} />;
}
