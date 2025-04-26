const API_BASE_URL = "api/cart";

export const fetchCart = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement du panier");
  }
  return await response.json();
};

export async function saveCartItem(ingredient) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingredient),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout au panier");
  }
}
