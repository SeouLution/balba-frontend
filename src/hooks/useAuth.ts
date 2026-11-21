import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logIn, signUp, type Me } from "@/api/auth";

import { meQueryKey } from "./useMe";

/** 이전 계정의 데이터를 모두 비우고 새 계정을 캐시에 넣는다. */
function useSaveMe() {
  const queryClient = useQueryClient();
  return (me: Me) => {
    // clear()는 진행 중인 로그인 mutation까지 지워서 쿼리만 비운다.
    queryClient.removeQueries();
    queryClient.setQueryData(meQueryKey, me);
  };
}

export function useLogIn() {
  const saveMe = useSaveMe();
  return useMutation({ mutationFn: logIn, gcTime: 0, onSuccess: saveMe });
}

export function useSignUp() {
  const saveMe = useSaveMe();
  return useMutation({ mutationFn: signUp, gcTime: 0, onSuccess: saveMe });
}
