import { LogoMark, Settings } from "@/components/icons";
import { cn } from "@/utils/cn";

type StoreHeaderProps = {
  storeName: string;
  onSettingsClick?: () => void;
  className?: string;
};

export function StoreHeader({ storeName, onSettingsClick, className }: StoreHeaderProps) {
  return (
    <header
      className={cn("flex h-17.5 items-center justify-between bg-button-surface-1 px-5", className)}
    >
      <LogoMark size={32} className="text-button-primary" />
      <div className="flex items-center gap-2.5">
        <span className="text-label-l text-text-black">{storeName}</span>
        <button
          type="button"
          aria-label="가게 설정"
          onClick={onSettingsClick}
          className="flex size-11 items-center justify-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          <Settings size={16} aria-hidden />
        </button>
      </div>
    </header>
  );
}
