export const ingredientExamples = [
  { id: "egg", name: "계란", menus: "김밥 · 참치김밥 · 라볶이 외 3개 메뉴", recommended: true },
  { id: "seaweed", name: "김", menus: "김밥 · 참치김밥 · 김치김밥 외 2개", recommended: true },
  { id: "radish", name: "단무지", menus: "김밥 · 참치김밥 외 3개", recommended: true },
  { id: "fish-cake", name: "어묵", menus: "떡볶이 · 어묵탕 · 라볶이", recommended: true },
  { id: "rice-cake", name: "떡", menus: "떡볶이 · 라볶이", recommended: true },
  { id: "pork", name: "돼지고기", menus: "제육덮밥 · 김치찌개", recommended: false },
  { id: "tuna", name: "참치캔", menus: "참치김밥 · 참치마요덮밥", recommended: false },
];

export const recommendedIds = ingredientExamples
  .filter(({ recommended }) => recommended)
  .map(({ id }) => id);

type RecipeExample = {
  name: string;
  unit: string;
  items: { name: string; amount: number; unit: string; step: number }[];
};

const gimbapIngredients = [
  { name: "김", amount: 1, unit: "장", step: 1 },
  { name: "밥", amount: 120, unit: "g", step: 5 },
  { name: "계란", amount: 0.5, unit: "개", step: 0.5 },
  { name: "단무지", amount: 20, unit: "g", step: 5 },
];

export const recipeExamples: RecipeExample[] = [
  { name: "김밥", unit: "줄", items: gimbapIngredients },
  {
    name: "참치김밥",
    unit: "줄",
    items: [...gimbapIngredients, { name: "참치", amount: 30, unit: "g", step: 5 }],
  },
  {
    name: "떡볶이",
    unit: "인분",
    items: [
      { name: "떡", amount: 150, unit: "g", step: 5 },
      { name: "어묵", amount: 40, unit: "g", step: 5 },
    ],
  },
  {
    name: "제육덮밥",
    unit: "인분",
    items: [
      { name: "돼지고기", amount: 120, unit: "g", step: 5 },
      { name: "밥", amount: 180, unit: "g", step: 5 },
    ],
  },
];
