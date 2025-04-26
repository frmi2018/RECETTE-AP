import { useState, useEffect } from "react";
import { fetchCart, saveCartItem } from "../modules/cartUtils"; // 👈

export default function IngredientCard({ ingredient }) {
  const [cart, setCart] = useState([]); // Panier de courses

  let unitéAffichée = ingredient.unité;
  if (ingredient.unite_facturation === "unité" && ingredient.quantité > 1) {
    unitéAffichée = ingredient.unité + "s";
  }

  const addToCart = async ingredient => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.nom === ingredient.nom);
      if (existingItem) {
        // Mise à jour localement aussi
        return prevCart.map(item =>
          item.nom === ingredient.nom
            ? { ...item, quantité: item.quantité + ingredient.quantité }
            : item,
        );
      } else {
        return [...prevCart, ingredient];
      }
    });
    await saveCartItem(ingredient);
    alert(`${ingredient.nom} a été ajouté au panier !`);
  };

  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
    };
    loadCart();
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        border: "2px solid black",
        borderRadius: "5px",
        padding: "10px",
        color: "black",
      }}
    >
      <img
        src={ingredient.image}
        alt={ingredient.nom}
        style={{ width: "200px", height: "200px" }}
      />
      <h3>{ingredient.nom}</h3>
      <p>{ingredient.marque}</p>
      <p>
        {ingredient.quantité} {unitéAffichée}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button>Edit</button>
        <button onClick={() => addToCart(ingredient)}>Panier</button>
        <button>Supprimer</button>
      </div>
    </div>
  );
}
