import { useState } from "react";
import ingredientsData from "@/data/ingredients.json";
import { updateRecipe } from "../../../lib/api-recipes";
import EditIngredientModal from "../../elements/Forms/UpdateIngredientInRecipeForm/UpdateIngredientInRecipeForm";
import AddIngredientRecipeModal from "../../elements/Forms/AddIngredientInRecipeForm/AddIngredientInRecipeForm";
import styles from './SelectedIngredientsList.module.css';

export default function RecipeIngredients({ ingredients, recipeId, onUpdate }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [editedIngredient, setEditedIngredient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddIngredientRecipeModal, setShowAddIngredientRecipeModal] = useState(false); // État pour afficher la modal d'ajout d'ingrédient

  // Extraire les IDs des ingrédients dans la recette pour pouvoir les filtrer
  const ingredientIds = ingredients.map(i => i.id);

  // Filtrer les ingrédients existants dans la recette avec les données de ingredientsData
  const selectedIngredients = ingredientsData
    .filter(data => ingredientIds.includes(data.id))
    .map(ingredient => {
      const recipeData = ingredients.find(i => i.id === ingredient.id);
      return { ...ingredient, quantité: recipeData.quantité, unité: recipeData.unité };
    });

  // Fonction pour supprimer un ingrédient de la recette
  const handleDelete = async (ingredient) => {
    if (window.confirm(`Supprimer ${ingredient.nom} ?`)) {
      const newIngredients = ingredients.filter(i => i.id !== ingredient.id);
      try {
        await updateRecipe(recipeId, { ingrédients: newIngredients });
        onUpdate && onUpdate(); // Recharge la recette si nécessaire
      } catch (err) {
        console.error("Erreur suppression ingrédient :", err);
        alert("Échec de la suppression.");
      }
    }
  };

  // Fonction pour ouvrir la modal d'édition d'un ingrédient
  const openModal = (ingredient) => {
    setEditedIngredient({ ...ingredient });
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  // Fonction pour ouvrir la modal d'ajout d'ingrédient
  const handleAddIngredientRecipe = () => {
    setShowAddIngredientRecipeModal(true);
  };

  // Fonction pour fermer la modal d'édition
  const onClose = () => {
    setShowModal(false);
  };

  // Fonction pour annuler la fermeture de la modal d'édition (demander confirmation)
  const onCancel = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées.",
    );
    if (confirmClose) {
      setShowModal(false);
    }
  };

  // Fonction pour mettre à jour l'ingrédient après modification
  const handleIngredientUpdate = async () => {
    setShowModal(false);
    onUpdate && onUpdate(); // Appelle la fonction du parent pour recharger la recette
  };

  // Fonction pour ajouter les nouveaux ingrédients dans la recette
  const handleAddIngredients = async (newIngredients) => {
    // Créer un nouvel objet pour chaque ingrédient sélectionné avec l'id, quantité et unité vides
    const ingredientsToAdd = newIngredients.map((ingredient) => ({
      id: ingredient.id,
      quantité: "",
      unité: "",
    }));
  
    // Ajoute ces nouveaux ingrédients à la recette existante
    const updatedIngredients = [...ingredients, ...ingredientsToAdd];
  
    try {
      // Met à jour la recette avec les nouveaux ingrédients
      await updateRecipe(recipeId, { ingrédients: updatedIngredients });
      onUpdate && onUpdate(); // Recharge la recette si nécessaire
    } catch (err) {
      console.error("Erreur ajout ingrédient :", err);
      alert("Échec de l'ajout des ingrédients.");
    }
  };
  
  

  // Fonction pour annuler l'ajout d'ingrédients
  const handleCancel = () => {
    setShowAddIngredientRecipeModal(false); // Ferme la modale
  };

  return (
    <div>

      <h3>Ingrédients</h3>

      <div>
      {selectedIngredients.map((ingredient, index) => (
  <div key={index} className={styles.ingredientRow}>
    <img
      src={ingredient.image}
      alt={ingredient.nom}
      className={styles.ingredientImage}
    />

    <strong className={styles.ingredientName}>{ingredient.nom}</strong>

    {(ingredient.quantité || ingredient.unité) ? (
      <div className={styles.ingredientQuantity}>
        {ingredient.quantité} {ingredient.unité}
      </div>
    ) : (
      <div className={styles.ingredientQuantity}>&nbsp;</div>
    )}

    <div className={styles.actions}>
      <button onClick={() => openModal(ingredient)}>✏️ Modifier</button>
      <button onClick={() => handleDelete(ingredient)}>🗑 Supprimer</button>
    </div>
  </div>
))}
        
        {/* Bouton pour ouvrir la modal d'ajout d'ingrédient */}
        <div>
          <button onClick={handleAddIngredientRecipe}>Ajouter un ingrédient</button>
        </div>
      </div>

      {/* Modal pour éditer un ingrédient */}
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

      {/* Modal pour ajouter un ingrédient à la recette */}
      {showAddIngredientRecipeModal && (
        <AddIngredientRecipeModal
          ingredients={ingredientsData}  // Liste complète des ingrédients
          ingredientsInRecipe={ingredients}  // Ingrédients déjà dans la recette
          onAddIngredient={handleAddIngredients}  // Fonction pour ajouter les ingrédients à la recette
          onCancell={handleCancel}  // Fonction pour annuler
        />
      )}
    </div>
  );
}
