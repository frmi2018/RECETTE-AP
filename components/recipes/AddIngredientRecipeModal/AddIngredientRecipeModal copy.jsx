import { useState } from "react";
import styles from "./AddIngredientRecipeModal.module.css";

export default function AddIngredientRecipeModal({ ingredients, ingredientsInRecipe, onAddIngredient, onCancell }) {

  console.log(ingredients); // Affiche la liste de tous les ingrédients

  // 1. Charger tous les ingrédients (tu les passes via props sous forme de `ingredients`)

  // 2. Filtrer pour retirer ceux déjà présents dans la recette (dans `ingredientsInRecipe`)
  const ingredientsNotInRecipe = ingredients.filter(
    ingredient => !ingredientsInRecipe.some(i => i.id === ingredient.id)
  );

  // 3. Créer un état pour gérer les ingrédients sélectionnés par l'utilisateur
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // 4. Fonction pour gérer les changements de sélection (cases à cocher)
  const handleCheckboxChange = (ingredientId) => {
    setSelectedIngredients(prevState => {
      if (prevState.includes(ingredientId)) {
        // Si l'élément est déjà sélectionné, on le retire
        return prevState.filter(id => id !== ingredientId);
      } else {
        // Sinon on l'ajoute
        return [...prevState, ingredientId];
      }
    });
  };

  // 5. Fonction pour gérer l'ajout des ingrédients sélectionnés dans la recette
  const handleAdd = () => {
    const newIngredients = ingredients.filter(ingredient =>
      selectedIngredients.includes(ingredient.id)
    );
    onAddIngredient(newIngredients); // Appelle la fonction de parent pour ajouter ces ingrédients
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un ingrédient</h3>

        {/* 6. Afficher la liste des ingrédients non encore présents dans la recette */}
        <div className={styles.ingredientsList}>
          {ingredientsNotInRecipe.map((ingredient) => (
            <div key={ingredient.id} className={styles.ingredientItem}>
              <input
                type="checkbox"
                id={ingredient.id}
                value={ingredient.id}
                onChange={() => handleCheckboxChange(ingredient.id)}
              />
              <label htmlFor={ingredient.id}>{ingredient.nom}</label>
            </div>
          ))}
        </div>

        <div className={styles.modalButtons}>
          {/* 7. Bouton pour ajouter les ingrédients sélectionnés */}
          <button onClick={handleAdd}>Ajouter</button>

          {/* 8. Bouton pour annuler l'ajout */}
          <button onClick={onCancell}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
