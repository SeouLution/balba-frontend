import { useMutation } from "@tanstack/react-query";

import { logIn, signUp } from "@/api/auth";

export function useLogIn() {
  return useMutation({ mutationFn: logIn, gcTime: 0 });
}

export function useSignUp() {
  return useMutation({ mutationFn: signUp, gcTime: 0 });
}
