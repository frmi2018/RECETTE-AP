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
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération de la recette avec id ${id}`,
    );
  }
  return await response.json();
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
};

// ✅ Mettre à jour une recette
export const updateRecipe = async (id, updatedFields) => {
  const response = await fetch("/api/recipes", {
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
      `Erreur lors de la suppression de l'ingrédient avec id ${id}`,
    );
  }
};
