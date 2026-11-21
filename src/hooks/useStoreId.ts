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
