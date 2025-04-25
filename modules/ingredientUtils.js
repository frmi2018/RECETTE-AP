import { fs } from "fs";

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
  // Écrire dans un fichier
  fs.writeFile(API_BASE_URL, ingredient, "utf8", err => {
    if (err) {
      console.error("Erreur lors de l'écriture :", err);
      return;
    }
    console.log("Données sauvegardées avec succès !");
    // Vous pouvez également retourner une promesse ici si nécessaire
    return Promise.resolve("Données sauvegardées avec succès !");
  });
};

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
