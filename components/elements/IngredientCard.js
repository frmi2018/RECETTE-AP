import React from "react";
import styles from "./IngredientCard.module.css";

export default function IngredientCard({
  ingredient,
  setShowModal,
  handleDelete,
}) {
  return (
    <div>
      <div className={styles.ingredientCard}></div>
      <div className={styles.ingredientImageWrapper}>
        <img
          src={ingredient.image}
          alt={ingredient.nom}
          className={styles.cardImage}
        />
      </div>
      <div className={styles.cardContent}>
        <strong>{ingredient.nom}</strong>
        {ingredient.quantité || ingredient.unité ? (
          <div>
            {ingredient.quantité} {ingredient.unité}
          </div>
        ) : (
          <div>&nbsp;</div>
        )}
        <div className={styles.actions}>
          <button onClick={() => setShowModal(true)}>✏️</button>
          <button onClick={() => handleDelete(ingredient.id)}>🗑</button>
        </div>
      </div>
    </div>
  );
}
