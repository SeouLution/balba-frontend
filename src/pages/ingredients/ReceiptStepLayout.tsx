import type { ReactNode } from "react";

import { AppPanel } from "@/components/AppPanel";
import { ReceiptHeader } from "./ReceiptHeader";

type ReceiptStepLayoutProps = {
  title: string;
  onBack: () => void;
  footer?: ReactNode;
  children: ReactNode;
};

/** 3.6 · 3.7 공통 틀: 상단 제목, 본문, 아래 고정 버튼 */
export function ReceiptStepLayout({ title, onBack, footer, children }: ReceiptStepLayoutProps) {
  return (
    <AppPanel>
      <ReceiptHeader title={title} onBack={onBack} />
      <main className="flex flex-1 flex-col gap-4 px-5 pb-6 md:px-8">{children}</main>
      {footer && (
        <footer className="sticky bottom-0 bg-button-surface-1 px-5 pt-2 pb-6 md:grid md:justify-items-end md:rounded-b-lg md:px-8 md:[&>button]:max-w-80 md:[&>p]:justify-self-stretch">
          {footer}
        </footer>
      )}
    </AppPanel>
  );
}
