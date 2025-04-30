const API_BASE_URL = "/api/brands";

// ✅ Obtenir tous les ingrédients
export const fetchBrands = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des marques");
  }
  return await response.json();
};

// ✅ Ajouter une marque

export const createBrand = async currentBrand => {
  const response = await fetch("/api/brands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newBrand: currentBrand }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la marque");
  }

  return await response.json(); // 👈 retourne directement les données JSON
};

// ✅ Remplacer la liste complète des marques
export const remplaceBrand = async brands => {
  const response = await fetch("/api/brands", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brands }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors du remplacement des marques");
  }

  return await response.json(); // retourne { success: true, updated: true }
};
