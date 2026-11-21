import { Navigate, Outlet } from "react-router";

import { ApiError } from "@/api/client";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { StoreIdContext } from "@/hooks/storeIdContext";
import { useMe } from "@/hooks/useMe";

/**
 * 로그인한 계정의 가게 id를 불러와 아래 화면에 넘겨준다.
 * 로그인이 안 됐으면 로그인 화면으로, 가게가 없으면 온보딩으로 보낸다.
 */
export function RequireStore() {
  const meQuery = useMe();

  if (meQuery.isPending) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <Loading>가게 정보를 불러오고 있어요.</Loading>
      </div>
    );
  }

  if (meQuery.isError) {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4">
        <p className="text-body-m text-text-gray-darker">가게 정보를 불러오지 못했어요.</p>
        <Button variant="secondary" onClick={() => meQuery.refetch()}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  if (!meQuery.data.storeId) return <Navigate to="/onboarding" replace />;

  return (
    <StoreIdContext.Provider value={meQuery.data.storeId}>
      <Outlet />
    </StoreIdContext.Provider>
  );
}
