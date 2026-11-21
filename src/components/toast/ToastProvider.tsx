import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Toast } from "@/components/toast/Toast";
import { ToastContext } from "@/components/toast/toastContext";

const TOAST_DURATION_MS = 2500;

type ToastState = { id: number; message: string };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const hideTimerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    window.clearTimeout(hideTimerRef.current);
    setToast({ id: Date.now(), message });
    hideTimerRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimerRef.current), []);

  return (
    <ToastContext value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-5"
      >
        {toast && (
          <Toast key={toast.id} className="w-full max-w-[350px]">
            {toast.message}
          </Toast>
        )}
      </div>
    </ToastContext>
  );
}
