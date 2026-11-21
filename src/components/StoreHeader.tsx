import { LogoMark } from "@/components/icons";
import { cn } from "@/utils/cn";

type StoreHeaderProps = {
  storeName: string;
  className?: string;
};

export function StoreHeader({ storeName, className }: StoreHeaderProps) {
  return (
    <header
      className={cn("flex h-17.5 items-center justify-between bg-button-surface-1 px-5", className)}
    >
      <LogoMark size={32} className="text-button-primary" />
      <span className="text-label-l text-text-black">{storeName}</span>
    </header>
  );
}
