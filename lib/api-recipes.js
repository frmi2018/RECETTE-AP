const API_BASE_URL = "/api/recipes";

// ✅ Obtenir toutes les recettes
export const fetchRecipes = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des recettes");
  }
  return await response.json();
};

// ✅ Obtenir une recette par ID
export const fetchRecipe = async id => {
  console.log("Demande à API la recette avec id =>", id);
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur ${response.status}: ${errorData.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette :", error);
    throw new Error(
      `Erreur lors de la récupération de la recette avec id ${id}`,
    );
  }
};

// ✅ Obtenir les infos des ingrédients d'une recette
export const fetchIngredientsByIds = async ids => {
  try {
    const response = await fetch("/api/ingredients/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erreur lors de la récupération des ingrédients : ${errorData.message}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la requête fetchIngredientsByIds :", error);
    throw error;
  }
};

// ✅ Obtenir 3 recettes aléatoires
export const fetchRandomRecipes = async () => {
  const recipes = await fetchRecipes();
  if (recipes.length <= 3) return recipes;

  const shuffled = recipes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// ✅ Ajouter une recette
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

  return await response.json();
};

// ✅ Mettre à jour une recette
export const updateRecipe = async (id, updatedFields) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updatedFields }),
  });

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la mise à jour de la recette avec id ${id}`,
    );
  }
};

// ✅ Supprimer une recette
export const deleteRecipe = async id => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la suppression de la recette avec id ${id}`,
    );
  }
};
