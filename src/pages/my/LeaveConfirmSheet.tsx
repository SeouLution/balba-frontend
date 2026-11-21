import { useEffect } from "react";

import { Button } from "@/components/Button";
import { X } from "@/components/icons";

type LeaveConfirmSheetProps = {
  onLeave: () => void;
  onStay: () => void;
};

/** 고친 내용을 저장하지 않고 화면을 떠나려 할 때 묻는 바텀시트 */
export function LeaveConfirmSheet({ onLeave, onStay }: LeaveConfirmSheetProps) {
  useEffect(() => {
    const stayOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onStay();
    };
    window.addEventListener("keydown", stayOnEscape);
    return () => window.removeEventListener("keydown", stayOnEscape);
  }, [onStay]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onStay}
        className="absolute inset-0 bg-text-black/60"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-confirm-title"
        aria-describedby="leave-confirm-description"
        className="relative w-full max-w-md rounded-t-3xl bg-button-surface-1 px-5 pt-3 pb-8"
      >
        <span aria-hidden className="mx-auto block h-1.5 w-11 rounded-pill bg-surface-gray-light" />
        <div className="mt-4 flex items-center justify-between gap-3">
          <h2 id="leave-confirm-title" className="text-subtitle text-text-black">
            수정 중인 정보가 있어요
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onStay}
            className="grid size-10 place-items-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
          >
            <X size={26} aria-hidden />
          </button>
        </div>
        <p id="leave-confirm-description" className="mt-2 text-body-s text-text-gray">
          이 화면을 나가면 입력한 정보가 모두 사라져요.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onLeave}>
            나가기
          </Button>
          <Button onClick={onStay}>돌아가기</Button>
        </div>
      </section>
    </div>
  );
}
