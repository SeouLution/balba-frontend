export type StoreCategory = "BUNSIK" | "KOREAN_MEAL" | "GUKBAP" | "BANCHAN" | "BAKERY" | "OTHER";
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type DayHours = {
  day: DayOfWeek;
  closed: boolean;
  open?: string;
  close?: string;
};

export type SalesColumn = "date" | "menuName" | "quantity";
export type ColumnMapping = Partial<Record<SalesColumn, string>>;

export type RecipeUnit = "개" | "g";

export type RecipeIngredient = {
  id: string;
  name: string;
  amount: number;
  unit: RecipeUnit;
};
