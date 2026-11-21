import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logOut } from "@/api/auth";

/** 로그아웃 후 이전 계정의 데이터를 모두 비우고 로그인 화면으로 보낸다. */
export function useLogOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });
}
