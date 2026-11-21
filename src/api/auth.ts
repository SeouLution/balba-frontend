import { request } from "@/api/client";

type Credentials = {
  phoneNumber: string;
  password: string;
};

export type Me = {
  userId: string;
  // 가게를 아직 만들지 않았으면 null
  storeId: string | null;
  phoneNumber: string;
};

function authenticate(path: string, credentials: Credentials) {
  return request<Me>(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function logIn(credentials: Credentials) {
  return authenticate("/v1/auth/login", credentials);
}

export function signUp(credentials: Credentials) {
  return authenticate("/v1/auth/signup", credentials);
}

/** 로그인 쿠키를 지운다. */
export function logOut() {
  return request<void>("/v1/auth/logout", { method: "POST" });
}

/** 로그인 쿠키로 지금 로그인한 계정을 불러온다. 쿠키가 없거나 만료되면 401 */
export function getMe(signal?: AbortSignal) {
  return request<Me>("/v1/users/me", { signal });
}
