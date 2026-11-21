import { useQuery } from "@tanstack/react-query";

import { listIngredients } from "@/api/ingredients";

export function useIngredients(storeId: string) {
  return useQuery({
    queryKey: ["ingredients", storeId],
    queryFn: () => listIngredients(storeId),
  });
}
