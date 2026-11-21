import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";

import { Button } from "@/components/Button";
import { Check, ChevronLeft, LogoMark, SparkIcon, X } from "@/components/icons";
import { Progress } from "@/components/Progress";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/utils/cn";

const progressLabels = ["가게 정보", "엑셀 올리기", "핵심 재료 고르기", "레시피 초안"];
const startBenefits = [
  "어제 매출과 날씨, 요일을 보고 내일 필요한 양을 계산해요",
  "품절 위험과 유통기한 임박 재료를 먼저 알려드려요.",
  "추천은 발주바주가, 최종 발주는 사장님이 확정해요.",
];

type OnboardingScreenProps = {
  step?: number;
  onBack?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  completed?: boolean;
};

export function OnboardingScreen({
  step,
  onBack,
  header,
  footer,
  children,
  completed,
}: OnboardingScreenProps) {
  const currentStep = completed ? 5 : step;

  return (
    <div className="min-h-dvh bg-bg-page min-[1025px]:grid min-[1025px]:grid-cols-[minmax(290px,29.17%)_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-button-primary px-10 py-10 text-text-white min-[1025px]:flex">
        <div className="flex items-center gap-2 text-wordmark">
          <LogoMark size={32} aria-hidden />
          발주바주
        </div>
        {currentStep ? (
          <>
            <p className="mt-12 text-body-m font-semibold min-[1200px]:text-subtitle">
              원활한 서비스 이용을 위해
              <br />
              몇가지 정보를 입력해 주세요.
            </p>
            <ol className="mt-6 grid gap-4">
              {progressLabels.map((label, index) => {
                const position = index + 1;
                return (
                  <li
                    key={label}
                    aria-current={position === currentStep ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-3 text-label-s",
                      position === currentStep && "font-semibold text-ai-spark",
                      position > currentStep && "text-text-white/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full border border-text-white/35 text-caption",
                        position === currentStep &&
                          "border-ai-spark bg-ai-spark text-button-primary",
                        position < currentStep && "bg-text-white text-button-primary",
                      )}
                    >
                      {position < currentStep ? <Check size={16} aria-hidden /> : position}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <div className="mt-auto min-h-0 overflow-y-auto pt-8">
            <p className="inline-flex items-center gap-2.5 rounded-pill bg-ai-spark px-3.5 py-2 text-label-s-b font-bold text-button-primary min-[1600px]:gap-3 min-[1600px]:px-4 min-[1600px]:text-subtitle">
              <SparkIcon className="size-5 shrink-0 min-[1600px]:size-6" />
              동네식당 AI 발주 도우미
            </p>
            <p className="mt-6 text-subtitle font-bold break-keep min-[1320px]:text-title min-[1600px]:text-display-l">
              감이 아니라 <span className="text-ai-spark">데이터</span>로
              <br />
              내일 발주를 정하세요.
            </p>
            <ul className="mt-8 grid gap-4 text-body-s break-keep min-[1600px]:text-body-l">
              {startBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check size={18} className="mt-1 shrink-0 text-ai-spark" aria-hidden />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-label-s">
              도움이 필요하면{" "}
              <strong className="font-semibold underline underline-offset-4">고객센터</strong>
            </p>
          </div>
        )}
      </aside>
      <div className="flex min-w-0 justify-center min-[1025px]:p-10 md:p-6">
        <main className="flex min-h-dvh w-full min-w-0 flex-col bg-button-surface-1 min-[1025px]:min-h-[calc(100dvh-80px)] md:min-h-[calc(100dvh-48px)] md:max-w-[600px] md:rounded-lg">
          {header ??
            (onBack && (
              <TopBar
                onBack={onBack}
                step={step ? { current: step, total: 4 } : undefined}
                className="h-[72px] rounded-t-lg pr-5 pl-2 md:h-20 md:pr-10 md:pl-5"
              />
            ))}
          {step && <Progress value={step} max={4} />}
          <div className="flex flex-1 flex-col px-5 pt-5 pb-2 md:px-10 md:pt-10">{children}</div>
          {footer && (
            <footer className="grid gap-2.5 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] md:px-10 md:pb-10">
              {footer}
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}

export function OnboardingHeading({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5 grid gap-2">
      <h1 className="text-[20px]/7 break-keep max-md:font-medium md:text-title">{title}</h1>
      {children && <p className="text-body-s text-text-gray-darker">{children}</p>}
    </div>
  );
}

export function OnboardingButton({
  secondary,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { secondary?: boolean }) {
  return (
    <Button
      {...props}
      variant={secondary ? "secondary" : "primary"}
      className={cn(
        "h-[52px]! rounded-sm text-label-l font-medium shadow-none disabled:border-transparent disabled:bg-button-subtle disabled:text-text-gray",
        secondary
          ? "border-border-grey bg-button-surface-1 text-text-black enabled:hover:border-border-primary enabled:hover:bg-button-subtle enabled:hover:text-text-black"
          : "bg-button-primary text-text-white enabled:hover:bg-button-primary-hover enabled:active:bg-button-primary-pressed",
        className,
      )}
    />
  );
}

export function OnboardingLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-sm text-center text-label-s text-text-black underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}

export function OnboardingError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-caption text-danger-default">
      {children}
    </p>
  );
}

export function OnboardingDialog({
  title,
  onClose,
  children,
  fullScreenOnMobile,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  fullScreenOnMobile?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "fixed inset-x-0 m-0 w-full max-w-none overflow-auto bg-transparent text-text-black backdrop:bg-text-black/80 md:inset-0 md:m-auto md:max-h-[92dvh] md:max-w-[600px] md:rounded-lg",
        fullScreenOnMobile
          ? "inset-y-0 h-dvh max-h-none md:h-auto"
          : "top-auto bottom-0 max-h-[92dvh] rounded-t-[24px]",
      )}
    >
      <div
        className={cn(
          "bg-button-surface-1 px-5 pb-[max(24px,env(safe-area-inset-bottom))] md:px-6 md:pt-4",
          fullScreenOnMobile && "min-h-full",
        )}
      >
        {!fullScreenOnMobile && (
          <div
            aria-hidden
            className="mx-auto mb-3 h-[5px] w-11 translate-y-3 rounded-full bg-surface-gray-light md:hidden"
          />
        )}
        <div
          className={cn(
            "flex min-h-14 items-center gap-4",
            fullScreenOnMobile
              ? "mb-3 -ml-3 min-h-[72px] md:ml-0 md:min-h-14 md:justify-between"
              : "justify-between",
          )}
        >
          <h2 id={titleId} className="text-label-l md:text-subtitle">
            {title}
          </h2>
          <button
            type="button"
            aria-label={fullScreenOnMobile ? "주소 검색 닫기" : "닫기"}
            onClick={onClose}
            className={cn(
              "grid size-11 place-items-center rounded-sm focus-visible:ring-2 focus-visible:ring-button-primary focus-visible:outline-none",
              fullScreenOnMobile && "order-first md:order-none",
            )}
          >
            {fullScreenOnMobile && <ChevronLeft size={24} aria-hidden className="md:hidden" />}
            <X
              size={20}
              aria-hidden
              className={fullScreenOnMobile ? "hidden md:block" : undefined}
            />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
