import { useEffect, type ReactNode } from "react";

import type { IngredientSummary } from "@/api/ingredients";
import { Camera, PenLine, X } from "@/components/icons";

type IngredientInfoSheetProps = {
  ingredient: IngredientSummary;
  onClose: () => void;
  onDirectInput: () => void;
  onTakeReceipt: () => void;
};

/** 재료 줄의 아이콘을 누르면 뜨는 "정보 입력" 바텀시트 */
export function IngredientInfoSheet({
  ingredient,
  onClose,
  onDirectInput,
  onTakeReceipt,
}: IngredientInfoSheetProps) {
  // Esc로도 닫히게 한다.
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-text-black/60"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ingredient-info-sheet-title"
        className="relative w-full max-w-md rounded-t-3xl bg-button-surface-1 px-4 pt-3 pb-8"
      >
        <span aria-hidden className="mx-auto block h-1.5 w-11 rounded-pill bg-surface-gray-light" />
        <div className="mt-3 flex items-center justify-between px-1">
          <h2 id="ingredient-info-sheet-title" className="text-label-l text-text-black">
            정보 입력
            <span className="sr-only"> · {ingredient.name}</span>
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <SheetOption icon={<PenLine size={22} aria-hidden />} onClick={onDirectInput}>
            직접 입력하기
          </SheetOption>
          <SheetOption icon={<Camera size={22} aria-hidden />} onClick={onTakeReceipt}>
            영수증 촬영하기
          </SheetOption>
        </div>
      </section>
    </div>
  );
}

function SheetOption({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border border-border-grey text-label-l text-text-black outline-none hover:bg-bg-hover focus-visible:ring-4 focus-visible:ring-button-primary/20 active:bg-button-subtle"
    >
      <span className="text-border-primary">{icon}</span>
      {children}
    </button>
  );
}
