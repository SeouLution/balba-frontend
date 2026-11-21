import { request } from "@/api/client";

type Credentials = {
  phoneNumber: string;
  password: string;
};

type Me = {
  userId: string;
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

export function getMe(signal?: AbortSignal) {
  return request<Me>("/v1/users/me", { signal });
}
