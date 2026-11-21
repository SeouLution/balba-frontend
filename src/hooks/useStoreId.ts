// TODO: A와 storeId 보관 방식(1.1 createStore 응답 저장)을 정하면 이 훅만 바꾼다.
// 지금은 openapi.yaml 예시값이라 운영 백엔드에서는 NOT_FOUND가 난다.
const TEMP_STORE_ID = "st_8f2k1";

export function useStoreId() {
  return TEMP_STORE_ID;
}
