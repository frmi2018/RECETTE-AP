import React, { useEffect, useState } from "react";
import styles from "./IngredientCard.module.css";
import { deleteCartItem, saveCartItem } from "@/lib/api-cart";

export default function IngredientCard({
  ingredient,
  cartItems,
  onEdit,
  onDelete,
}) {
  const getUnitWithPlural = (quantité, unite) => {
    if (unite === "unité" && quantité > 1) {
      return `${unite}s`;
    }
    return unite;
  };

  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const isInCart = cartItems.some(item => item.id === ingredient.id);
    setInCart(isInCart);
  }, [cartItems, ingredient.id]);

  const toggleCartStatus = async () => {
    try {
      if (inCart) {
        await deleteCartItem(ingredient.id);
      } else {
        await saveCartItem({ id: ingredient.id, quantité_a_acheter: 1 });
      }
      setInCart(!inCart);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier", error);
    }
  };

  return (
    <div>
      <div className={styles.ingredientCard}>
        <div className={styles.ingredientImageWrapper}>
          <img
            src={ingredient.image}
            alt={ingredient.nom}
            className={
              ingredient.image === "/images/icons/pas-image.png"
                ? styles.addImage
                : styles.cardImage
            }
          />
        </div>
        <div className={styles.cardContent}>
          <strong>{ingredient.nom}</strong>
          {ingredient.quantité || ingredient.unité ? (
            <div>
              {ingredient.quantité}{" "}
              {getUnitWithPlural(ingredient.quantité, ingredient.unité)}
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
          <div>
            <button onClick={() => onEdit(ingredient)}>✏️</button>
            <button onClick={() => onDelete(ingredient.id)}>🗑</button>
            <button onClick={toggleCartStatus} className={styles.cartButton}>
              <img
                src={
                  inCart
                    ? "/images/icons/remove-cart.png"
                    : "/images/icons/add-cart.png"
                }
                alt={inCart ? "Retirer du panier" : "Ajouter au panier"}
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
