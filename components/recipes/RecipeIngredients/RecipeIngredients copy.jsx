import { useState } from "react";
import ingredientsData from "@/data/ingredients.json";
import { updateRecipe } from "../../../lib/api-recipes";
import styles from "./RecipeIngredients.module.css";
import EditIngredientModal from "../EditIngredientModal/EditIngredientModal";


export default function RecipeIngredients({ ingredients, recipeId, onUpdate }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [editedIngredient, setEditedIngredient] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const ingredientIds = ingredients.map(i => i.id);
  const selectedIngredients = ingredientsData
    .filter(data => ingredientIds.includes(data.id))
    .map(ingredient => {
      const recipeData = ingredients.find(i => i.id === ingredient.id);
      return { ...ingredient, quantité: recipeData.quantité, unité: recipeData.unité };
    });

  const handleDelete = async (ingredient) => {
    if (window.confirm(`Supprimer ${ingredient.nom} ?`)) {
      const newIngredients = ingredients.filter(i => i.id !== ingredient.id);
      try {
        await updateRecipe(recipeId, { ingrédients: newIngredients });
        onUpdate && onUpdate(); // recharge la recette si nécessaire
      } catch (err) {
        console.error("Erreur suppression ingrédient :", err);
        alert("Échec de la suppression.");
      }
    }
  };

  const openModal = (ingredient) => {
    setEditedIngredient({ ...ingredient });
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  const onClose = () => {
      setShowModal(false);
  };

  const onCancel = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées.",
    );
    if (confirmClose) {
      setShowModal(false);
    }
  };

  const handleIngredientUpdate = async () => {
    setShowModal(false);
    onUpdate && onUpdate(); // ← appelle la fonction du parent pour recharger la recette
  };
  
  

  return (
    <div>
      <h3 className={styles.title}>Ingrédients</h3>
      <div className={styles.ingredientGrid}>
        {selectedIngredients.map((ingredient, index) => (
          <div key={index} className={styles.ingredientCard}>
            <div className={styles.cardImageWrapper}>
              <img
                src={ingredient.image}
                alt={ingredient.nom}
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <strong>{ingredient.nom}</strong>

                {(ingredient.quantité||ingredient.unité)?(
                <div>{ingredient.quantité} {ingredient.unité}</div>
            ):(<div>&nbsp;</div>)}
              
              <div className={styles.buttonGroup}>
                <button onClick={() => openModal(ingredient)}>✏️ Éditer</button>
                <button onClick={() => handleDelete(ingredient)}>🗑 Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
  <EditIngredientModal
    editedIngredient={editedIngredient} // ← ingrédient sélectionné
    recipeId={recipeId}
    ingredients={ingredients}
    onClose={onClose}
    onCancel={onCancel}
    onIngredientUpdate={handleIngredientUpdate}
  />
)}
    </div>
  );
}
