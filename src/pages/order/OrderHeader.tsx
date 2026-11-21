import { useNavigate } from "react-router";

import { ChevronLeft } from "@/components/icons";

type OrderHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

/** 뒤로 가기 + 제목 + 회색 보조 문구 */
export function OrderHeader({ title, subtitle, onBack }: OrderHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-20 items-center gap-3 px-3">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack ?? (() => navigate(-1))}
        className="grid size-11 place-items-center rounded-sm text-text-black outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
      >
        <ChevronLeft size={26} strokeWidth={2.2} aria-hidden />
      </button>
      <h1 className="text-subtitle text-text-black">{title}</h1>
      {subtitle && <span className="text-body-s text-text-gray">{subtitle}</span>}
    </header>
  );
}
