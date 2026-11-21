import { useEffect, useRef, useState } from "react";

import { Settings } from "@/components/icons";
import { useToast } from "@/components/toast/useToast";
import { useLogOut } from "@/hooks/useLogOut";

/** 홈 상단 톱니 버튼. 누르면 로그아웃 메뉴가 뜬다. */
export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();
  const logOut = useLogOut();

  // 메뉴 밖을 누르거나 Esc를 누르면 닫는다.
  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="설정"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="grid size-10 place-items-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <Settings size={22} aria-hidden />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-40 mt-1 min-w-36 overflow-hidden rounded-md border border-border-grey bg-button-surface-1 py-1 shadow-toast"
        >
          <button
            type="button"
            role="menuitem"
            disabled={logOut.isPending}
            onClick={() =>
              logOut.mutate(undefined, {
                onError: () => showToast("로그아웃하지 못했어요. 다시 눌러 주세요."),
              })
            }
            className="flex h-12 w-full items-center px-4 text-label-s text-text-black outline-none hover:bg-bg-hover focus-visible:bg-bg-hover disabled:text-text-gray"
          >
            {logOut.isPending ? "로그아웃하는 중" : "로그아웃"}
          </button>
        </div>
      )}
    </div>
  );
}
