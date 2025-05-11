const API_BASE_URL = "../api/cart";

export const fetchCart = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Erreur lors du chargement du panier");
  }
  return await response.json();
};

export async function saveCartItem(ingredient) {
  const { id, quantité_a_acheter } = ingredient;
  console.log(id, quantité_a_acheter);

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, quantité_a_acheter }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout au panier");
  }
}

export async function deleteCartItem(id) {
  const response = await fetch(API_BASE_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du panier");
  }
}
