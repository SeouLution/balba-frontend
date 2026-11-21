import { useQuery } from "@tanstack/react-query";

import { listIngredients } from "@/api/ingredients";

export function useIngredients(storeId: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["ingredients", storeId],
    enabled,
    queryFn: () => listIngredients(storeId),
  });
}
