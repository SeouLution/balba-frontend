import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "starting" | "ready" | "denied" | "unavailable";

// 30장을 한 번에 올리므로 긴 변을 줄여 용량을 맞춘다.
const MAX_IMAGE_EDGE = 2000;
const JPEG_QUALITY = 0.85;

function canUseCamera() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

/** 후면 카메라를 <video>에 띄우고, capture()로 지금 장면을 jpeg Blob으로 잘라낸다. */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>(() =>
    canUseCamera() ? "starting" : "unavailable",
  );

  useEffect(() => {
    if (!canUseCamera()) return;

    let stream: MediaStream | null = null;
    // StrictMode에서 두 번 마운트될 때 먼저 끝난 요청의 카메라를 꺼 주기 위한 표시
    let isCancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((mediaStream) => {
        if (isCancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        const isPermissionDenied =
          error instanceof DOMException && error.name === "NotAllowedError";
        setStatus(isPermissionDenied ? "denied" : "unavailable");
      });

    return () => {
      isCancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capture = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  }, []);

  return { videoRef, status, capture };
}
