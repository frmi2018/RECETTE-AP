const API_BASE_URL = "/api/ingredients";

// ✅ Obtenir tous les ingrédients
export const fetchIngredients = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des ingrédients");
  }
  return await response.json();
};

// ✅ Obtenir un ingrédient par ID
export const fetchIngredient = async id => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération de l'ingrédient avec id ${id}`,
    );
  }
  return await response.json();
};

// ✅ Ajouter un ingrédient
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

// ✅ Mettre à jour un ingrédient
export const updateIngredient = async (id, updatedFields) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la mise à jour de l'ingrédient avec id ${id}`,
    );
  }
};

// ✅ Supprimer un ingrédient
export const deleteIngredient = async id => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la suppression de l'ingrédient avec id ${id}`,
    );
  }
};
