import { useState } from "react";
import styles from ".././Form.module.css";

const ITEMS_PER_PAGE = 10;

export default function AddIngredientInRecipeForm({
  ingredients,
  ingredientsInRecipe,
  onAddIngredient,
  onCancell,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtrer les ingrédients disponibles
  const availableIngredients = ingredients.filter(
    ingredient => !ingredientsInRecipe.some(ing => ing.id === ingredient.id)
  );

  // Calculer les indices des ingrédients à afficher
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedIngredients = availableIngredients.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
      <button onClick={onCancell}>Fermer</button>
        <h3>Ajouter un ingrédient</h3>

        {/* Liste paginée des ingrédients */}
        <div className={styles.ingredientList}>
          {paginatedIngredients.map((ingredient) => (
            <div key={ingredient.id} className={styles.ingredientItem}>
              <input
                type="checkbox"
                id={`ingredient-${ingredient.id}`}
                onChange={() => onAddIngredient([ingredient])} // Ajouter l'ingrédient
              />
              <label htmlFor={`ingredient-${ingredient.id}`}>
                {ingredient.nom}
              </label>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          {Array.from({ length: Math.ceil(availableIngredients.length / ITEMS_PER_PAGE) }, (_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>


      </div>
    </div>
  );
}
