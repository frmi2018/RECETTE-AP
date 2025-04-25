const API_BASE_URL = "api/recipes.json";

export const fetchRecipes = async () => {
  const response = await fetch(API_BASE_URL);
  return await response.json();
};

export const createRecipe = async recipe => {
  await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
};
