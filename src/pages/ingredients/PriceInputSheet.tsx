import { useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

import { MAX_RECEIPT_IMAGES } from "@/api/receiptScans";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  PenLine,
  ReceiptText,
  X,
} from "@/components/icons";
import { ResponsiveSheet } from "@/components/ResponsiveSheet";
import { useCreateReceiptScan } from "@/hooks/useReceiptScan";

import type { ReceiptFlowEntryState } from "./ReceiptFlowPage";
import { toJpeg } from "./toJpeg";

const RECEIPT_FLOW_PATH = "/receipt?returnTo=/ingredients";

type SheetStep = "choose" | "upload";

type PriceInputSheetProps = {
  storeId: string;
  // "단가 일괄 불러오기"는 업로드 방식 선택부터 연다.
  initialStep?: SheetStep;
  onClose: () => void;
  onDirectInput?: () => void;
  // 주지 않으면 재료 탭의 영수증 화면(/receipt)으로 간다. 온보딩은 자기 화면 안에서 연다.
  onCamera?: () => void;
  onAlbumUploaded?: (entry: ReceiptFlowEntryState) => void;
};

/** 단가 정보 입력(직접 입력 · 영수증) → 업로드 방식 선택(카메라 · 앨범) 바텀시트 */
export function PriceInputSheet({
  storeId,
  initialStep = "choose",
  onClose,
  onDirectInput,
  onCamera,
  onAlbumUploaded,
}: PriceInputSheetProps) {
  const navigate = useNavigate();
  const createReceiptScan = useCreateReceiptScan(storeId);
  const [step, setStep] = useState<SheetStep>(initialStep);
  const [albumError, setAlbumError] = useState<string | null>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  async function uploadAlbumPhotos(files: File[]) {
    if (files.length === 0) return;
    setAlbumError(null);
    const selected = files.slice(0, MAX_RECEIPT_IMAGES);
    let images: Blob[];
    try {
      images = await Promise.all(selected.map(toJpeg));
    } catch {
      setAlbumError("사진을 읽지 못했어요. 다른 사진을 골라 주세요.");
      return;
    }
    createReceiptScan.mutate(images, {
      onSuccess: ({ id }) => {
        const entry: ReceiptFlowEntryState = { scanId: id, photoCount: images.length };
        if (onAlbumUploaded) onAlbumUploaded(entry);
        else navigate(RECEIPT_FLOW_PATH, { state: entry });
      },
      onError: () => setAlbumError("사진을 올리지 못했어요. 다시 시도해 주세요."),
    });
  }

  const title = step === "choose" ? "단가 정보 입력" : "업로드 방식 선택";

  return (
    <ResponsiveSheet
      titleId="price-input-sheet-title"
      onClose={onClose}
      className="overflow-y-auto px-5 pt-3 pb-8"
    >
      <span
        aria-hidden
        className="mx-auto block h-1.5 w-11 rounded-pill bg-surface-gray-light md:hidden"
      />
      <div className="mt-3 flex items-center gap-2">
        {/* 직접 입력에서 들어온 경우에만 앞 단계로 돌아갈 수 있다. */}
        {step === "upload" && initialStep === "choose" && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => {
              setAlbumError(null);
              setStep("choose");
            }}
            className="-ml-2 grid size-10 place-items-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
          >
            <ChevronLeft size={24} aria-hidden />
          </button>
        )}
        <h2 id="price-input-sheet-title" className="flex-1 text-label-l text-text-black">
          {title}
        </h2>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-sm text-border-primary outline-none focus-visible:ring-4 focus-visible:ring-button-primary/20"
        >
          <X size={26} aria-hidden />
        </button>
      </div>

      {step === "choose" ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ChooseOption icon={<PenLine size={24} aria-hidden />} onClick={onDirectInput}>
            직접 입력하기
          </ChooseOption>
          <ChooseOption
            icon={<ReceiptText size={24} aria-hidden />}
            onClick={() => setStep("upload")}
          >
            영수증 촬영하기
          </ChooseOption>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <UploadOption
            icon={<Camera size={24} aria-hidden />}
            title="카메라로 촬영하기"
            description="지금 영수증을 바로 찍어요"
            disabled={createReceiptScan.isPending}
            onClick={onCamera ?? (() => navigate(RECEIPT_FLOW_PATH))}
          />
          <UploadOption
            icon={<ImageIcon size={24} aria-hidden />}
            title={createReceiptScan.isPending ? "사진을 올리고 있어요" : "앨범에서 선택하기"}
            description="미리 찍어둔 사진을 골라요"
            disabled={createReceiptScan.isPending}
            onClick={() => albumInputRef.current?.click()}
          />
          {albumError && (
            <p role="alert" className="text-caption text-danger-subtle-text">
              {albumError}
            </p>
          )}
          <input
            ref={albumInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              void uploadAlbumPhotos(Array.from(event.target.files ?? []));
              // 같은 사진을 다시 골라도 change가 일어나게 비운다.
              event.target.value = "";
            }}
          />
        </div>
      )}
    </ResponsiveSheet>
  );
}

function ChooseOption({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode;
  onClick?: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-28 flex-col items-center justify-center gap-3 rounded-lg border border-border-grey text-label-l text-text-black outline-none hover:bg-bg-hover focus-visible:ring-4 focus-visible:ring-button-primary/20 active:bg-button-subtle"
    >
      <span className="text-border-primary">{icon}</span>
      {children}
    </button>
  );
}

function UploadOption({
  icon,
  title,
  description,
  disabled,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-4 rounded-lg border border-border-grey px-4 py-4 text-left outline-none hover:bg-bg-hover focus-visible:ring-4 focus-visible:ring-button-primary/20 disabled:opacity-60"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-md bg-bg-page text-border-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-label-l font-semibold text-text-black">{title}</span>
        <span className="mt-0.5 block text-body-s text-text-gray">{description}</span>
      </span>
      <ChevronRight size={22} aria-hidden className="shrink-0 text-text-gray" />
    </button>
  );
}
