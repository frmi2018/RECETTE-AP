const API_BASE_URL = "api/recipes.json";

export const fetchRecipes = async () => {
  const response = await fetch(API_BASE_URL);
  return await response.json();
};

// Fetch a single recipe by ID
export const fetchRecipe = async id => {
  const response = await fetch(API_BASE_URL, id);
  return await response.json();
};

export const createRecipe = async recipe => {
  await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
};
