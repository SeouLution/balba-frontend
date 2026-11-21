import { useQuery } from "@tanstack/react-query";

import { listIngredients, type IngredientStatus } from "@/api/ingredients";

export function useIngredients(storeId: string, status?: IngredientStatus) {
  return useQuery({
    queryKey: ["ingredients", storeId, status],
    queryFn: () => listIngredients(storeId, status),
  });
}
