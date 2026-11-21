import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";

import brandLogo from "@/assets/brand/balba-logo-white.svg";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Check, ChevronLeft, X } from "@/components/icons";
import { OnboardingIntro } from "@/components/OnboardingIntro";
import { Progress } from "@/components/Progress";
import { TopBar } from "@/components/TopBar";
import { cn } from "@/utils/cn";

const progressSteps: { label: string; details?: string[]; optional?: boolean }[] = [
  { label: "가게 정보" },
  { label: "POS 엑셀" },
  { label: "재료 선택", details: ["AI 재료 정리", "재료 고르기"] },
  { label: "영수증 (선택)", optional: true },
  { label: "완료 확인" },
];

type OnboardingScreenProps = {
  step?: number;
  sidebarStep?: number;
  onBack?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  completed?: boolean;
  receiptAttached?: boolean;
  wideCard?: boolean;
  preparingIngredients?: boolean;
  scrollBody?: boolean;
  progressPercent?: number;
};

export function OnboardingScreen({
  step,
  sidebarStep,
  onBack,
  header,
  footer,
  children,
  completed,
  receiptAttached = false,
  wideCard,
  preparingIngredients,
  scrollBody,
  progressPercent,
}: OnboardingScreenProps) {
  const currentStep = completed ? progressSteps.length : (sidebarStep ?? step);
  const ingredientDetailIndex = preparingIngredients ? 0 : 1;

  return (
    <div className="min-h-dvh bg-bg-page min-[1025px]:grid min-[1025px]:grid-cols-[minmax(290px,29.17%)_1fr]">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh flex-col bg-button-primary px-10 py-10 text-text-white min-[1025px]:flex",
          currentStep && "overflow-y-auto",
        )}
      >
        <img
          src={brandLogo}
          alt="발주바주"
          width={155}
          height={41}
          className="shrink-0 self-start"
        />
        {currentStep ? (
          <>
            <p className="mt-12 text-title break-keep">
              원활한 서비스 이용을 위해
              <br />
              몇가지 정보를 입력해 주세요.
            </p>
            <ol className="mt-10 grid gap-5 text-subtitle font-bold">
              {progressSteps.map(({ label, details, optional }, index) => {
                const position = index + 1;
                const isDone = completed || position < currentStep || (optional && receiptAttached);
                const isCurrent = !isDone && position === currentStep;
                const isDeferred = optional && !receiptAttached && position < currentStep;
                return (
                  <li
                    key={label}
                    aria-current={isCurrent ? "step" : undefined}
                    className="grid gap-4"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-5",
                        isDeferred && "w-[251px] max-w-full",
                        !isCurrent && !isDone && "text-text-gray",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-[42px] shrink-0 items-center justify-center rounded-full border border-border-primary p-3",
                          isCurrent && "border-ai-spark bg-ai-spark text-text-black",
                          isDone && "border-bg-page bg-bg-page text-text-black",
                        )}
                      >
                        {isDone ? (
                          <>
                            <Check size={16} className="shrink-0" aria-hidden />
                            <span className="sr-only">완료</span>
                          </>
                        ) : (
                          <span className="text-center text-label-s-b font-semibold">
                            {position}
                          </span>
                        )}
                      </span>
                      <span className={cn("min-w-0 break-keep", isDeferred && "flex-1")}>
                        {label}
                      </span>
                      {isDeferred && (
                        <Badge
                          type="outline"
                          className="h-7.5 w-[51px] justify-center rounded-[6px] border border-button-subtle bg-transparent px-1.5 py-1 font-medium text-text-white"
                        >
                          나중에
                        </Badge>
                      )}
                    </div>
                    {details && (
                      <ul className="grid gap-4 pl-[62px] text-body-m font-normal">
                        {details.map((detail, detailIndex) => {
                          const isDetailCurrent =
                            isCurrent && step === 3 && detailIndex === ingredientDetailIndex;
                          const isDetailDone =
                            isDone ||
                            (isCurrent && (step === 4 || detailIndex < ingredientDetailIndex));

                          return (
                            <li
                              key={detail}
                              aria-current={isDetailCurrent ? "step" : undefined}
                              className={cn(
                                "flex items-center gap-2 break-keep",
                                !isDetailCurrent && !isDetailDone && "text-text-gray",
                              )}
                            >
                              <span
                                aria-hidden
                                className={cn(
                                  "size-2 shrink-0 rounded-full border border-border-primary",
                                  isDetailCurrent && "border-ai-spark bg-ai-spark",
                                  isDetailDone && "border-bg-page bg-bg-page",
                                )}
                              />
                              {detail}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <OnboardingIntro />
        )}
      </aside>
      <div
        className={cn(
          "flex min-w-0 justify-center min-[1025px]:p-10",
          wideCard ? "md:max-[1025px]:p-6" : "md:p-6",
        )}
      >
        <main
          className={cn(
            "flex min-h-dvh w-full min-w-0 flex-col bg-button-surface-1 md:max-w-[600px]",
            wideCard
              ? "items-start justify-between min-[1025px]:min-h-[calc(100dvh-80px)] md:min-w-[530px] md:overflow-clip md:rounded-[24px] md:max-[1025px]:min-h-[calc(100dvh-48px)] [&>*]:w-full"
              : "min-[1025px]:min-h-[calc(100dvh-80px)] md:min-h-[calc(100dvh-48px)] md:rounded-lg",
            scrollBody &&
              "min-[1025px]:h-[calc(100dvh-80px)] min-[1025px]:min-h-0 md:min-h-0 md:max-[1025px]:h-[calc(100dvh-48px)] md:max-[1025px]:min-h-0 md:[&>:not([data-scroll-body])]:shrink-0",
          )}
        >
          {header ??
            (onBack && (
              <TopBar
                onBack={onBack}
                step={step ? { current: step, total: 4 } : undefined}
                className="h-[72px] rounded-t-lg pr-5 pl-2 md:h-20 md:pr-10 md:pl-5"
              />
            ))}
          {step && (
            <Progress value={progressPercent ?? step} max={progressPercent == null ? 4 : 100} />
          )}
          <div
            data-scroll-body={scrollBody || undefined}
            className={cn(
              "flex flex-1 flex-col px-5 pt-5 pb-2 md:px-10 md:pt-10",
              scrollBody && "md:min-h-0 md:overflow-y-auto md:pb-10",
            )}
          >
            {children}
          </div>
          {footer && (
            <footer
              className={cn(
                "grid gap-2.5 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] md:px-10 md:pb-10",
                scrollBody && "md:pt-0",
              )}
            >
              {footer}
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}

export function OnboardingHeading({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 grid gap-2", className)}>
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
