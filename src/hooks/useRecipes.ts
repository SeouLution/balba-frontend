import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listRecipes, saveRecipes, type SaveRecipesRequest } from "@/api/recipes";

const RECIPE_POLLING_MS = 2000;

/** 메뉴별 레시피. AI가 만드는 중(GENERATING)이면 끝날 때까지 다시 조회한다. */
export function useRecipes(storeId: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["recipes", storeId],
    enabled,
    queryFn: () => listRecipes(storeId),
    refetchInterval: (query) =>
      query.state.status !== "error" && query.state.data?.generationStatus === "GENERATING"
        ? RECIPE_POLLING_MS
        : false,
  });
}

export function useSaveRecipes(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveRecipesRequest) => saveRecipes(storeId, body),
    // 레시피가 바뀌면 재료 목록 · 발주 계산도 달라진다.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes", storeId] });
      queryClient.invalidateQueries({ queryKey: ["ingredients", storeId] });
      queryClient.invalidateQueries({ queryKey: ["home", storeId] });
    },
  });
}
