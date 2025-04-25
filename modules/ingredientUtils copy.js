const API_BASE_URL = "api/ingredients.json";

export const fetchIngredients = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des ingrédients : ${response.status}`,
    );
  }
  return await response.json();
};

export const createIngredient = async ingredient => {
  await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredient),
  }).catch(error => {
    console.error("Erreur lors de la création de l'ingrédient :", error);
  });
};
