import { request } from "@/api/client";

/** 로그인 쿠키를 지운다. */
export function logOut() {
  return request<void>("/v1/auth/logout", { method: "POST" });
}
