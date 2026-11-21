import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getMe, type Me } from "@/api/auth";
import { ApiError } from "@/api/client";
import { createStore } from "@/api/stores";

import { meQueryKey } from "./useMe";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Parameters<typeof createStore>[0]) => {
      try {
        const store = await createStore(body);
        return { id: store.id, name: store.name };
      } catch (error) {
        // 저장은 끝났지만 응답을 받지 못한 경우에도 기존 가게로 이어갈 수 있다.
        if (!(error instanceof ApiError) || error.status !== 409) throw error;
        const { storeId } = await getMe();
        if (!storeId) throw error;
        return { id: storeId };
      }
    },
    // 계정 캐시의 storeId를 채워야 홈으로 갈 때 온보딩으로 되돌아가지 않는다.
    onSuccess: ({ id }) => {
      queryClient.setQueryData<Me>(meQueryKey, (me) => (me ? { ...me, storeId: id } : me));
    },
  });
}
