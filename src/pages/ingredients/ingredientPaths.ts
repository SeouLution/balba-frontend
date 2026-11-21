/** 레시피 수정 화면 주소. 저장하면 returnTo로 돌아온다. */
export function recipeEditPath(menuId: string, returnTo: string) {
  return `/ingredients/recipes/${menuId}?${new URLSearchParams({ returnTo })}`;
}
