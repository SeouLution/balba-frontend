import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/api/client";
import { getMe } from "@/api/users";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    // 401(로그인 안 됨)은 다시 시도해도 같으므로 바로 넘긴다.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 401) && failureCount < 2,
  });
}
