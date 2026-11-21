import type { RecipeExample } from "./ingredientExamples";
import type { OnboardingContext } from "./onboardingContext";

type RecipeEdits = Pick<
  OnboardingContext,
  "editedMenuIngredients" | "recipeAmounts" | "recipeUnits"
>;

export function getRecipeIngredients(
  menu: RecipeExample,
  { editedMenuIngredients, recipeAmounts, recipeUnits }: RecipeEdits,
) {
  const items =
    editedMenuIngredients[menu.name] ?? menu.items.map((item) => ({ ...item, id: item.name }));

  return items.map((item) => {
    const key = `${menu.name}/${item.id}`;
    return {
      ...item,
      amount: recipeAmounts[key] ?? item.amount,
      unit: recipeUnits[key] ?? item.unit,
    };
  });
}

export function withoutMenuOverrides<T>(overrides: Record<string, T>, menuName: string) {
  return Object.fromEntries(
    Object.entries(overrides).filter(([key]) => !key.startsWith(`${menuName}/`)),
  );
}
