import styles from './IngredientCard.module.css';
import { saveCartItem, deleteCartItem } from '@/lib/api-cart';
import { useState, useEffect } from 'react';

export default function IngredientCard({ ingredient, openModal, handleDelete, cartItems }) {
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
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={ingredient.image}
          alt={ingredient.nom}
          className={styles.image}
        />
      </div>
      <div className={styles.name}>{ingredient.nom}</div>
      <div className={styles.quantity}>
        {(ingredient.quantite || ingredient.unite) ? (
          <span>
            {ingredient.quantite} {ingredient.unite}
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
      <div className={styles.actions}>
        <button onClick={() => openModal(ingredient)} className={styles.editButton}>✏️</button>
        <button onClick={() => handleDelete(ingredient)} className={styles.deleteButton}>🗑</button>
        <button onClick={toggleCartStatus} className={styles.cartButton}>
          <img
            src={inCart ? "/images/icons/remove-cart.png" : "/images/icons/add-cart.png"}
            alt={inCart ? "Retirer du panier" : "Ajouter au panier"}
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
