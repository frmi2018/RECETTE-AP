const API_BASE_URL = "api/ingredients";

export const fetchIngredients = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des ingrédients");
  }
  return await response.json();
};

export const createIngredient = async ingredient => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredient),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'ingrédient");
  }
};

export const fetchIngredient = async id => {
  const response = await fetch(`/api/ingredients/${id}`);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération de l'ingrédient avec id ${id}`,
    );
  }
  return await response.json();
};

// Fetch the next available ID for a new ingredient
export const getNextId = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des ingrédients : ${response.status}`,
    );
  }

  const ingredients = await response.json();

  // Trouver l'ID le plus élevé
  const maxId = ingredients.reduce((max, ingredient) => {
    return ingredient.id > max ? ingredient.id : max;
  }, 0);

  // Retourner l'ID suivant
  return maxId + 1;
};
