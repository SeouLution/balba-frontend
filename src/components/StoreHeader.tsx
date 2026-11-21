import type { ReactNode } from "react";

import { LogoMark } from "@/components/icons";
import { cn } from "@/utils/cn";

type StoreHeaderProps = {
  storeName: string;
  // 가게 이름 오른쪽에 붙는 버튼(설정 등)
  actions?: ReactNode;
  className?: string;
};

export function StoreHeader({ storeName, actions, className }: StoreHeaderProps) {
  return (
    <header
      className={cn("flex h-17.5 items-center justify-between bg-button-surface-1 px-5", className)}
    >
      <LogoMark size={32} className="text-button-primary" />
      <div className="flex items-center gap-3">
        <span className="text-label-l text-text-black">{storeName}</span>
        {actions}
      </div>
    </header>
  );
}
