import { useEffect, useEffectEvent, useRef, useState } from "react";

import { loadPostcodeSearch } from "@/api/postcode";

export function usePostcodeSearch(onSelect: (postcode: string, roadAddress: string) => void) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selectionError, setSelectionError] = useState(false);
  const selectAddress = useEffectEvent(onSelect);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    let active = true;
    loadPostcodeSearch()
      .then((Postcode) => {
        if (!active) return;

        new Postcode({
          width: "100%",
          height: "100%",
          minWidth: 0,
          oncomplete: ({ zonecode, roadAddress }) => {
            if (!active) return;
            if (roadAddress) selectAddress(zonecode, roadAddress);
            else setSelectionError(true);
          },
        }).embed(element, { autoClose: false });
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
      element.replaceChildren();
    };
  }, []);

  return { container, status, selectionError };
}
