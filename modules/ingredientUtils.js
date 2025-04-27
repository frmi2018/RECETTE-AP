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
