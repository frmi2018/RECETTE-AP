import { useState, useEffect } from "react";
import { fetchCart, saveCartItem, deleteCartItem } from "@/lib/cartUtils";
import styles from "./IngredientShoppingCard.module.css";

export default function IngredientShoppingCard() {
  const [cart, setCart] = useState([]);

  // Charger le panier
  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
    };
    loadCart();
  }, []);

  const addQteToCart = async ingredient => {
    const updatedCart = cart.map(item =>
      item.id === ingredient.id
        ? { ...item, quantité_a_acheter: item.quantité_a_acheter + 1 }
        : item,
    );
    setCart(updatedCart);

    await saveCartItem({
      id: ingredient.id,
      quantité_a_acheter: ingredient.quantité_a_acheter + 1,
    });
  };

  const subQteToCart = async ingredient => {
    if (ingredient.quantité_a_acheter <= 0) return;

    const updatedCart = cart.map(item =>
      item.id === ingredient.id
        ? { ...item, quantité_a_acheter: item.quantité_a_acheter - 1 }
        : item,
    );
    setCart(updatedCart);

    await saveCartItem({
      id: ingredient.id,
      quantité_a_acheter: ingredient.quantité_a_acheter - 1,
    });
  };

  const deleteFromCart = async id => {
    const ingredient = cart.find(item => item.id === id);
    const confirmed = window.confirm(`Supprimer ${ingredient.nom} du panier ?`);
    if (!confirmed) return;

    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);

    await deleteCartItem(id);
  };

  return (
    <div>
      {cart.map(ingredient => (
        <div key={ingredient.id} className={styles.ingredientCard}>
          <div className={styles.ingredientImageWrapper}>
            <img
              src={ingredient.image}
              alt={ingredient.nom}
              className={styles.cardImage}
            />
          </div>

          <div className={styles.cardContent}>
            <strong>{ingredient.nom}</strong>
            {ingredient.marque ? (
              <div>{ingredient.marque}</div>
            ) : (
              <div>&nbsp;</div>
            )}

            <div className={styles.actions}>
              <button onClick={() => addQteToCart(ingredient)}>+</button>
              <button
                onClick={() => subQteToCart(ingredient)}
                disabled={ingredient.quantité_a_acheter <= 0}
              >
                -
              </button>
              <button onClick={() => deleteFromCart(ingredient.id)}>🗑</button>
            </div>

            <div className={styles.cartQuantity}>
              {ingredient.quantité_a_acheter} dans le panier
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
