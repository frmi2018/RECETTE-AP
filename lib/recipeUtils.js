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
