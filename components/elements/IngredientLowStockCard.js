import { useState, useEffect } from "react";
import { fetchCart, saveCartItem, deleteCartItem } from "@/lib/api-cart";

export default function IngredientCard({ ingredient }) {
  const [cart, setCart] = useState([]);

  // Trouver l'ingrédient actuel dans le panier
  const currentItem = cart.find(item => item.id === ingredient.id);
  const currentQte = currentItem?.quantité_a_acheter || 0;

  const addQteToCart = async ingredient => {
    let updatedItem;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === ingredient.id);
      if (existingItem) {
        updatedItem = {
          ...existingItem,
          quantité_a_acheter: existingItem.quantité_a_acheter + 1,
        };
        return prevCart.map(item =>
          item.id === ingredient.id ? updatedItem : item,
        );
      } else {
        updatedItem = { ...ingredient, quantité_a_acheter: 1 };
        return [...prevCart, updatedItem];
      }
    });

    await saveCartItem({
      id: ingredient.id,
      quantité_a_acheter: currentQte + 1,
    });

    alert(
      `Il y a maintenant ${currentQte + 1} ${ingredient.nom} dans le panier !`,
    );
  };

  const subQteToCart = async ingredient => {
    if (currentQte <= 0) return;

    let updatedItem;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === ingredient.id);
      if (existingItem && existingItem.quantité_a_acheter > 0) {
        updatedItem = {
          ...existingItem,
          quantité_a_acheter: existingItem.quantité_a_acheter - 1,
        };
        return prevCart.map(item =>
          item.id === ingredient.id ? updatedItem : item,
        );
      }
      return prevCart;
    });

    await saveCartItem({
      id: ingredient.id,
      quantité_a_acheter: currentQte - 1,
    });

    alert(
      `Il y a maintenant ${currentQte - 1} ${ingredient.nom} dans le panier !`,
    );
  };

  const deleteFromCart = async ingredient => {
    const confirmed = window.confirm(
      `Supprimer complètement ${ingredient.nom} du panier ?`,
    );
    if (!confirmed) return;

    setCart(prevCart => prevCart.filter(item => item.id !== ingredient.id));

    try {
      await deleteCartItem(ingredient.id);
      alert(`${ingredient.nom} a été retiré du panier.`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression de l'ingrédient.");
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      const cart = await fetchCart();
      setCart(cart);
    };
    loadCart();
  }, []);

  return (
    <div>
      <div>
        <img src={ingredient.image} alt={ingredient.nom} />
      </div>

      <div>
        <strong>{ingredient.nom}</strong>
        {ingredient.marque ? <div>{ingredient.marque}</div> : <div>&nbsp;</div>}

        <div>
          {/* Ajouter +1 */}
          <button onClick={() => addQteToCart(ingredient)}>+</button>

          {/* Enlever -1 */}
          <button
            onClick={() => subQteToCart(ingredient)}
            disabled={currentQte <= 0}
          >
            -
          </button>

          {/* Supprimer complètement */}
          <button onClick={() => deleteFromCart(ingredient)}>🗑</button>
        </div>
        <div>{currentQte} dans le panier</div>
      </div>
    </div>
  );
}
