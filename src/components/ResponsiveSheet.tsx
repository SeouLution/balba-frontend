import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/utils/cn";

export function ResponsiveSheet({
  titleId,
  descriptionId,
  role,
  onClose,
  children,
  className,
}: {
  titleId: string;
  descriptionId?: string;
  role?: "alertdialog";
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-x-0 top-auto bottom-0 mx-auto w-full max-w-md bg-transparent p-0 backdrop:bg-text-black/60 md:inset-0 md:m-auto md:max-w-xl"
    >
      <div
        className={cn(
          "max-h-dvh rounded-t-3xl bg-button-surface-1 text-text-black md:max-h-[calc(100dvh-3rem)] md:rounded-lg",
          className,
        )}
      >
        {children}
      </div>
    </dialog>
  );
}
