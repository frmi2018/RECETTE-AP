const API_BASE_URL = "/api/recipes";

export const fetchRecipes = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des recettes");
  }
  return await response.json();
};

export const createRecipe = async recipe => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la recette");
  }
};

export const fetchRecipe = async id => {
  const response = await fetch(`/api/recipes/${id}`);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération de la recette avec id ${id}`,
    );
  }
  return await response.json();
};

// Fetch the next available ID for a new recette
export const getNextId = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des recettes : ${response.status}`,
    );
  }

  const recipes = await response.json();

  // Trouver l'ID le plus élevé
  const maxId = recipes.reduce((max, recipe) => {
    return recipe.id > max ? recipe.id : max;
  }, 0);

  // Retourner l'ID suivant
  return maxId + 1;
};
