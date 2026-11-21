import type { RecipeIngredient } from "./onboardingTypes";

type RecipeIngredientExample = Omit<RecipeIngredient, "id">;

export type RecipeExample = {
  name: string;
  unit: string;
  items: RecipeIngredientExample[];
};

const gimbapIngredients: RecipeIngredientExample[] = [
  { name: "김", amount: 1, unit: "개" },
  { name: "밥", amount: 200, unit: "g" },
  { name: "계란", amount: 0.5, unit: "개" },
  { name: "단무지", amount: 1, unit: "개" },
];

export const recipeExamples: RecipeExample[] = [
  { name: "김밥", unit: "줄", items: gimbapIngredients },
  {
    name: "참치김밥",
    unit: "줄",
    items: [...gimbapIngredients, { name: "참치", amount: 30, unit: "g" }],
  },
  {
    name: "떡볶이",
    unit: "인분",
    items: [
      { name: "떡", amount: 150, unit: "g" },
      { name: "어묵", amount: 40, unit: "g" },
    ],
  },
  {
    name: "제육덮밥",
    unit: "인분",
    items: [
      { name: "돼지고기", amount: 120, unit: "g" },
      { name: "밥", amount: 180, unit: "g" },
    ],
  },
];

const [gimbap, tunaGimbap, tteokbokki, porkRice] = recipeExamples;

const gimbapExtras: RecipeIngredientExample[] = [
  { name: "당근", amount: 20, unit: "g" },
  { name: "오이", amount: 15, unit: "g" },
  { name: "햄", amount: 20, unit: "g" },
  { name: "참기름", amount: 5, unit: "g" },
  { name: "소금", amount: 1, unit: "g" },
  { name: "깨", amount: 2, unit: "g" },
];

const tteokbokkiExtras: RecipeIngredientExample[] = [
  { name: "고추장", amount: 20, unit: "g" },
  { name: "고춧가루", amount: 5, unit: "g" },
  { name: "대파", amount: 15, unit: "g" },
  { name: "설탕", amount: 10, unit: "g" },
  { name: "간장", amount: 10, unit: "g" },
];

export const ingredientMenuExamples: RecipeExample[] = [
  { ...gimbap, items: [...gimbap.items, ...gimbapExtras] },
  { ...tunaGimbap, items: [...tunaGimbap.items, ...gimbapExtras.slice(0, 5)] },
  { ...tteokbokki, items: [...tteokbokki.items, ...tteokbokkiExtras] },
  {
    name: "라볶이",
    unit: "인분",
    items: [{ name: "라면", amount: 1, unit: "개" }, ...tteokbokki.items, ...tteokbokkiExtras],
  },
  {
    ...porkRice,
    items: [
      ...porkRice.items,
      { name: "양파", amount: 30, unit: "g" },
      { name: "대파", amount: 15, unit: "g" },
    ],
  },
  {
    name: "어묵탕",
    unit: "인분",
    items: [
      { name: "어묵", amount: 100, unit: "g" },
      { name: "무", amount: 25, unit: "g" },
      { name: "대파", amount: 10, unit: "g" },
      { name: "멸치 육수", amount: 200, unit: "g" },
    ],
  },
];
