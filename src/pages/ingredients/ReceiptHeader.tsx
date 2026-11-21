import { ChevronLeft } from "@/components/icons";

type ReceiptHeaderProps = {
  title: string;
  onBack: () => void;
};

/** 3.6 · 3.7 상단: 뒤로 가기 + 제목 */
export function ReceiptHeader({ title, onBack }: ReceiptHeaderProps) {
  return (
    <header className="flex h-16 items-center gap-1 px-3">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="flex size-11 items-center justify-center rounded-sm text-text-black outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <ChevronLeft size={24} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
      </button>
      <h1 className="text-label-l text-text-black">{title}</h1>
    </header>
  );
}
