export type RecipeUnit = "개" | "g";

export type RecipeIngredient = {
  id: string;
  name: string;
  amount: number;
  unit: RecipeUnit;
};
