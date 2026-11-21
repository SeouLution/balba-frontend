import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/auth";

export const meQueryKey = ["me"] as const;

/**
 * 로그인한 계정. 로그인 · 회원가입 · 가게 생성 때 캐시를 직접 채우고, 로그아웃 때 비운다.
 * 그래서 화면을 옮길 때마다 다시 받지 않는다.
 */
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: ({ signal }) => getMe(signal),
    staleTime: Infinity,
    retry: false,
  });
}
