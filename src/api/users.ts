import { request } from "@/api/client";

export type Me = {
  userId: string;
  // 가게를 아직 만들지 않았으면 null
  storeId: string | null;
  phoneNumber: string;
};

/** 로그인 쿠키로 지금 로그인한 계정을 불러온다. 쿠키가 없거나 만료되면 401 */
export function getMe() {
  return request<Me>("/v1/users/me");
}
