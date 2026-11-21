// 앨범 사진을 다시 저장할 때의 JPEG 품질
const JPEG_QUALITY = 0.9;

/** 영수증 API는 JPEG만 받는다. PNG 등은 캔버스에 그려 JPEG로 바꾼다. */
export async function toJpeg(file: File): Promise<Blob> {
  if (file.type === "image/jpeg") return file;
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("JPEG로 바꾸지 못했어요."))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}
