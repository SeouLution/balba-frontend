import { Box, CircleUserRound, House, Tag } from "@/components/icons";
import type { TabBarItem } from "@/components/TabBar";

export const appNavItems: TabBarItem[] = [
  { to: "/home", label: "홈", icon: House },
  { to: "/ingredients", label: "재료", icon: Box },
  { to: "/order", label: "발주", icon: Tag },
  { to: "/my", label: "내정보", icon: CircleUserRound },
];
