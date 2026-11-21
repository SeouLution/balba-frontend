export type RecipeExample = {
  name: string;
  unit: string;
  items: { name: string; amount: number; unit: string; step: number }[];
};

const gimbapIngredients = [
  { name: "김", amount: 1, unit: "장", step: 1 },
  { name: "밥", amount: 200, unit: "g", step: 5 },
  { name: "계란", amount: 0.5, unit: "개", step: 0.5 },
  { name: "단무지", amount: 1, unit: "줄", step: 1 },
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

const [gimbap, tunaGimbap, tteokbokki, porkRice] = recipeExamples;

const gimbapExtras = [
  { name: "당근", amount: 20, unit: "g", step: 5 },
  { name: "오이", amount: 15, unit: "g", step: 5 },
  { name: "햄", amount: 20, unit: "g", step: 5 },
  { name: "참기름", amount: 5, unit: "g", step: 1 },
  { name: "소금", amount: 1, unit: "g", step: 1 },
  { name: "깨", amount: 2, unit: "g", step: 1 },
];

const tteokbokkiExtras = [
  { name: "고추장", amount: 20, unit: "g", step: 5 },
  { name: "고춧가루", amount: 5, unit: "g", step: 1 },
  { name: "대파", amount: 15, unit: "g", step: 5 },
  { name: "설탕", amount: 10, unit: "g", step: 1 },
  { name: "간장", amount: 10, unit: "ml", step: 1 },
];

export const ingredientMenuExamples: RecipeExample[] = [
  { ...gimbap, items: [...gimbap.items, ...gimbapExtras] },
  { ...tunaGimbap, items: [...tunaGimbap.items, ...gimbapExtras.slice(0, 5)] },
  { ...tteokbokki, items: [...tteokbokki.items, ...tteokbokkiExtras] },
  {
    name: "라볶이",
    unit: "인분",
    items: [
      { name: "라면", amount: 1, unit: "개", step: 1 },
      ...tteokbokki.items,
      ...tteokbokkiExtras,
    ],
  },
  {
    ...porkRice,
    items: [
      ...porkRice.items,
      { name: "양파", amount: 30, unit: "g", step: 5 },
      { name: "대파", amount: 15, unit: "g", step: 5 },
    ],
  },
  {
    name: "어묵탕",
    unit: "인분",
    items: [
      { name: "어묵", amount: 100, unit: "g", step: 5 },
      { name: "무", amount: 25, unit: "g", step: 5 },
      { name: "대파", amount: 10, unit: "g", step: 5 },
      { name: "멸치 육수", amount: 200, unit: "ml", step: 5 },
    ],
  },
];
