// openapi.yaml 예시값. 운영 · 로컬 백엔드에는 없는 가게라 실제 API에서는 NOT_FOUND가 난다.
const FALLBACK_STORE_ID = "st_8f2k1";

/**
 * 지금 가게 id.
 * 테스트할 때는 .env.local의 VITE_STORE_ID로 바꿔 끼운다(POST /v1/stores로 만든 id).
 * TODO: A와 storeId 보관 방식(가입 · 1.1 createStore 응답)을 정하면 이 훅 안만 바꾼다.
 */
export function useStoreId() {
  return import.meta.env.VITE_STORE_ID || FALLBACK_STORE_ID;
}
