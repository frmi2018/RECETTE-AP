import React from "react";
import styles from "./IngredientCard.module.css";

export default function IngredientCard({
  ingredient,
  setShowEditIngredientModal,
  handleDelete,
}) {
  return (
    <div>
      <div className={styles.ingredientCard}>
        <div className={styles.ingredientImageWrapper}>
          <img
            src={ingredient.image}
            alt={ingredient.nom}
            className={
              ingredient.image == "/images/icons/pas-image.png"
                ? styles.addImage
                : styles.cardImage
            }
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
          <div>
            {/* Ouvre la modal d'édition de l'ingrédient */}
            <button onClick={() => setShowEditIngredientModal(true)}>✏️</button>
            <button onClick={() => handleDelete(ingredient.id)}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
