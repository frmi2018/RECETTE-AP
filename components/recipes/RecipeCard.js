import React from "react";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ recipe }) {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.cardImageWrapper}>
        <img
          src={recipe.image}
          alt={recipe.nom}
          className={
            recipe.image == "/images/icons/pas-image.png"
              ? styles.addImage
              : styles.cardImage
          }
        />
      </div>
      <div className={styles.cardContent}>
        <strong>{recipe.nom}</strong>
      </div>
    </div>
  );
}
