import { useEffect, useRef, useState } from "react";

import { MAX_RECEIPT_IMAGES } from "@/api/receiptScans";
import { Button } from "@/components";
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
  onUploaded: (scanId: string) => void;
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
      { onSuccess: ({ id }) => onUploaded(id) },
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
        <h1 className="flex-1 text-label-l">영수증 촬영</h1>
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
            {status === "denied" &&
              "카메라 권한이 필요해요. 브라우저 설정에서 카메라를 허용해 주세요."}
            {status === "unavailable" && "이 기기에서는 카메라를 쓸 수 없어요."}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
        <Button
          variant="secondary"
          disabled={photos.length === 0 || createReceiptScan.isPending}
          onClick={handleDone}
          className="w-full"
        >
          {createReceiptScan.isPending ? "올리는 중이에요" : "다 찍었어요"}
        </Button>

        <p className="text-center text-label-s text-text-white/70">
          {createReceiptScan.isError
            ? "사진을 올리지 못했어요. 다시 눌러 주세요."
            : isFull
              ? `최대 ${MAX_RECEIPT_IMAGES}장까지 찍을 수 있어요`
              : "거래처 상관없이 연달아 찍어 주세요"}
        </p>

        {photos.length > 0 && (
          <ul className="flex gap-2 overflow-x-auto" aria-label="찍은 영수증">
            {photos.map((photo, index) => (
              <li key={photo.id} className="shrink-0">
                <img
                  src={photo.previewUrl}
                  alt={`영수증 ${index + 1}`}
                  className={cn(
                    "h-14 w-10 rounded-sm object-cover",
                    index === photos.length - 1 && "ring-2 ring-ai-spark",
                  )}
                />
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          aria-label="찍기"
          disabled={!canShoot}
          onClick={handleShutter}
          className="mx-auto mt-1 size-18 rounded-pill border-4 border-text-white/40 bg-text-white outline-none focus-visible:ring-4 focus-visible:ring-ai-spark disabled:opacity-40"
        />
      </div>
    </div>
  );
}
