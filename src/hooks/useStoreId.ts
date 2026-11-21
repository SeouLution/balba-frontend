import { useContext } from "react";

import { StoreIdContext } from "./storeIdContext";

/** 로그인한 계정의 가게 id. RequireStore 아래 화면에서만 쓸 수 있다. */
export function useStoreId() {
  const storeId = useContext(StoreIdContext);
  if (!storeId) {
    throw new Error("useStoreId는 RequireStore 안에서만 쓸 수 있어요.");
  }
  return storeId;
}

/** RequireStore 밖(온보딩 등)에서도 부를 수 있는 버전. 가게 id가 없으면 null */
export function useOptionalStoreId() {
  return useContext(StoreIdContext);
}
