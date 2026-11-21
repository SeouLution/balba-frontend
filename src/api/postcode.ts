const postcodeScriptUrl = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

type PostcodeResult = {
  zonecode: string;
  roadAddress: string;
};

type PostcodeConstructor = new (options: {
  oncomplete: (result: PostcodeResult) => void;
  width: string;
  height: string;
  minWidth: number;
}) => { embed: (element: HTMLElement, options: { autoClose: boolean }) => void };

declare global {
  interface Window {
    kakao?: { Postcode?: PostcodeConstructor };
  }
}

let loadingScript: Promise<PostcodeConstructor> | undefined;

export function loadPostcodeSearch() {
  if (window.kakao?.Postcode) return Promise.resolve(window.kakao.Postcode);

  loadingScript ??= new Promise<PostcodeConstructor>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = postcodeScriptUrl;
    script.async = true;

    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error("주소 검색을 불러오지 못했어요."));
    }

    const timeout = window.setTimeout(fail, 10000);
    script.addEventListener("error", fail, { once: true });
    script.addEventListener(
      "load",
      () => {
        const Postcode = window.kakao?.Postcode;
        if (!Postcode) {
          fail();
          return;
        }
        window.clearTimeout(timeout);
        resolve(Postcode);
      },
      { once: true },
    );
    document.head.append(script);
  }).catch((error: unknown) => {
    loadingScript = undefined;
    throw error;
  });

  return loadingScript;
}
