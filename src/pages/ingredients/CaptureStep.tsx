import { useEffect, useRef, useState } from "react";

import { MAX_RECEIPT_IMAGES } from "@/api/receiptScans";
import { ChevronLeft } from "@/components/icons";
import { useCamera } from "@/hooks/useCamera";
import { useCreateReceiptScan } from "@/hooks/useReceiptScan";
import { cn } from "@/utils/cn";

type CapturedPhoto = {
  id: number;
  blob: Blob;
  previewUrl: string;
};

type CaptureStepProps = {
  storeId: string;
  onBack: () => void;
  onUploaded: (scanId: string, photoCount: number) => void;
};

/** 3.5 영수증 연속 촬영 */
export function CaptureStep({ storeId, onBack, onUploaded }: CaptureStepProps) {
  const { videoRef, status, capture } = useCamera();
  const createReceiptScan = useCreateReceiptScan(storeId);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // 화면을 떠날 때 썸네일용 URL을 해제한다.
  const previewUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const isFull = photos.length >= MAX_RECEIPT_IMAGES;
  const canShoot = status === "ready" && !isFull && !isCapturing && !createReceiptScan.isPending;

  async function handleShutter() {
    if (!canShoot) return;
    setIsCapturing(true);
    const blob = await capture();
    setIsCapturing(false);
    if (!blob) return;

    const previewUrl = URL.createObjectURL(blob);
    previewUrlsRef.current.push(previewUrl);
    setPhotos((prev) => [...prev, { id: Date.now(), blob, previewUrl }]);
  }

  function handleDone() {
    createReceiptScan.mutate(
      photos.map((photo) => photo.blob),
      { onSuccess: ({ id }) => onUploaded(id, photos.length) },
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-button-primary text-text-white">
      <header className="flex h-16 items-center justify-between px-3">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-text-white/30"
        >
          <ChevronLeft size={24} strokeWidth={2.2} absoluteStrokeWidth aria-hidden />
        </button>
        <h1 className="flex-1 text-label-l">영수증 연속 촬영</h1>
        <span className="rounded-pill bg-ai-spark px-3 py-1 text-label-s text-text-black">
          {photos.length}장
        </span>
      </header>

      <div className="relative mx-5 flex-1 overflow-hidden rounded-md border border-dashed border-text-white/40">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn("size-full object-cover", status !== "ready" && "invisible")}
        />
        {status !== "ready" && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-body-m text-text-white/80">
            {status === "starting" && "카메라를 켜는 중이에요"}
            {status === "denied" && (
              <span>
                카메라 권한이 필요해요.
                <br />
                브라우저 설정에서 카메라를 허용해 주세요.
              </span>
            )}
            {status === "unavailable" && "이 기기에서는 카메라를 쓸 수 없어요."}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
        <button
          type="button"
          disabled={photos.length === 0 || createReceiptScan.isPending}
          onClick={handleDone}
          className="h-form-button w-full rounded-sm border border-border-grey bg-button-surface-1 text-label-l text-text-black outline-none focus-visible:ring-4 focus-visible:ring-ai-spark active:bg-button-subtle disabled:opacity-60"
        >
          {createReceiptScan.isPending ? "올리는 중이에요" : "다 찍었어요"}
        </button>

        <p className="text-center text-label-s text-text-white/70">
          {createReceiptScan.isError
            ? "사진을 올리지 못했어요. 다시 눌러 주세요."
            : isFull
              ? `최대 ${MAX_RECEIPT_IMAGES}장까지 찍을 수 있어요`
              : "한 장씩 찍으면 거래처별로 알아서 나눠요"}
        </p>

        {photos.length > 0 && (
          <ul
            className="mx-auto flex max-w-full gap-2 overflow-x-auto p-0.5"
            aria-label="찍은 영수증"
          >
            {photos.map((photo, index) => (
              <li key={photo.id} className="shrink-0">
                <img
                  src={photo.previewUrl}
                  alt={`영수증 ${index + 1}`}
                  className={cn(
                    "h-12 w-9 rounded-sm border-2 border-transparent object-cover",
                    // 방금 찍은 사진은 라임색 테두리
                    index === photos.length - 1 && "border-ai-spark",
                  )}
                />
              </li>
            ))}
          </ul>
        )}

        {/* 촬영 버튼: 흰 링 + 남색 틈 + 안쪽 흰 원 */}
        <button
          type="button"
          aria-label="찍기"
          disabled={!canShoot}
          onClick={handleShutter}
          className="mx-auto mt-1 flex size-19 items-center justify-center rounded-pill border-4 border-text-white outline-none focus-visible:ring-4 focus-visible:ring-ai-spark active:scale-95 disabled:opacity-40"
        >
          <span aria-hidden className="size-15 rounded-pill bg-text-white" />
        </button>
      </div>
    </div>
  );
}
