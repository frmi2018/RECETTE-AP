import { useState } from "react";
import ingredientsData from "@/data/ingredients.json";
import { updateRecipe } from "../../../lib/api-recipes";
import styles from "./RecipeIngredients.module.css";

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
        console.log("Ingrédient supprimé :", ingredient.nom);
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

  const handleSave = async () => {
    try {
      const updatedIngredients = ingredients.map(i =>
        i.id === editedIngredient.id
          ? { ...i, quantité: editedIngredient.quantité, unité: editedIngredient.unité }
          : i
      );

      await updateRecipe(recipeId, { ingrédients: updatedIngredients });
      onUpdate && onUpdate();
      setShowModal(false);
      alert("Modifications enregistrées !");
    } catch (err) {
      console.error("Erreur modification ingrédient :", err);
      alert("Échec de la modification.");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
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

      {showModal && editedIngredient && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Modifier l'ingrédient</h3>
            <label>
              Nom :
              <input
                type="text"
                value={editedIngredient.nom}
                onChange={e => setEditedIngredient({ ...editedIngredient, nom: e.target.value })}
                disabled // désactivé car nom = info globale
              />
            </label>
            <label>
              Photo (URL) :
              <input
                type="text"
                value={editedIngredient.image}
                onChange={e => setEditedIngredient({ ...editedIngredient, image: e.target.value })}
                disabled // image = info globale aussi
              />
            </label>                          <label>
                          Quantité :
                          <input
                            type="text"
                            value={editedIngredient.quantité}
                            onChange={e => setEditedIngredient({ ...editedIngredient, quantité: e.target.value })}
                          />
                        </label>
                        <label>
                          Unité :
                          <input
                            type="text"
                            value={editedIngredient.unité}
                            onChange={e => setEditedIngredient({ ...editedIngredient, unité: e.target.value })}
                          />
                        </label>
            <label>
              Quantité :
              <input
                type="text"
                value={editedIngredient.quantité}
                onChange={e => setEditedIngredient({ ...editedIngredient, quantité: e.target.value })}
              />
            </label>
            <label>
              Unité :
              <input
                type="text"
                value={editedIngredient.unité}
                onChange={e => setEditedIngredient({ ...editedIngredient, unité: e.target.value })}
              />
            </label>

            <div className={styles.modalButtons}>
              <button onClick={handleSave}>Enregistrer</button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
