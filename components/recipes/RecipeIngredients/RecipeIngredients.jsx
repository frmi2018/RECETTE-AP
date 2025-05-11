import { useState, useEffect } from "react";
import ingredientsData from "@/data/ingredients.json";
import { updateRecipe } from "../../../lib/api-recipes";
import { fetchCart } from "../../../lib/api-cart";
import EditIngredientModal from "../../elements/Forms/UpdateIngredientInRecipeForm/UpdateIngredientInRecipeForm";
import AddIngredientRecipeModal from "../../elements/Forms/AddIngredientInRecipeForm/AddIngredientInRecipeForm";
import IngredientCard from "./IngredientCard";
import styles from "./RecipeIngredients.module.css";

export default function RecipeIngredients({ ingredients, recipeId, recipe, onUpdate }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [editedIngredient, setEditedIngredient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddIngredientRecipeModal, setShowAddIngredientRecipeModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Charger les items du panier au montage
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartData = await fetchCart();
        setCartItems(cartData);
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
      }
    };

    loadCartItems();
  }, []);

  const ingredientIds = ingredients.map(i => i.id);

  const selectedIngredients = ingredientsData
    .filter(data => ingredientIds.includes(data.id))
    .map(ingredient => {
      const recipeData = ingredients.find(i => i.id === ingredient.id);
      return { ...ingredient, quantite: recipeData.quantite, unite: recipeData.unite };
    });

  const handleDelete = async (ingredient) => {
    if (window.confirm(`Supprimer ${ingredient.nom} ?`)) {
      const newIngredients = ingredients.filter(i => i.id !== ingredient.id);
      try {
        await updateRecipe(recipeId, { ingredients: newIngredients });
        onUpdate && onUpdate();
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

  const handleAddIngredientRecipe = () => {
    setShowAddIngredientRecipeModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onCancel = () => {
    const confirmClose = window.confirm(
      "Êtes-vous sûr de vouloir fermer sans sauvegarder ? Les modifications ne seront pas enregistrées."
    );
    if (confirmClose) {
      setShowModal(false);
    }
  };

  const handleIngredientUpdate = async () => {
    setShowModal(false);
    onUpdate && onUpdate();
  };

  const handleAddIngredients = async (newIngredients) => {
    const ingredientsToAdd = newIngredients.map((ingredient) => ({
      id: ingredient.id,
      quantite: "",
      unite: "",
    }));

    const updatedIngredients = [...ingredients, ...ingredientsToAdd];

    try {
      await updateRecipe(recipeId, { ingredients: updatedIngredients });
      onUpdate && onUpdate();
    } catch (err) {
      console.error("Erreur ajout ingrédient :", err);
      alert("Échec de l'ajout des ingrédients.");
    }
  };

  const handleCancel = () => {
    setShowAddIngredientRecipeModal(false);
  };

  return (
    <div>
      <h3>{selectedIngredients.length} Ingrédients</h3>
      <div className={styles.container}>
        {selectedIngredients.map((ingredient, index) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            recipe={recipe}
            openModal={openModal}
            handleDelete={handleDelete}
            cartItems={cartItems}  // <-- Passe le panier ici
          />
        ))}

        <div style={{ alignContent: "center", justifyContent: "center" }}>
          <button onClick={handleAddIngredientRecipe}>Ajouter un ingrédient</button>
        </div>

        {showModal && (
          <EditIngredientModal
            editedIngredient={editedIngredient}
            recipeId={recipeId}
            ingredients={ingredients}
            onClose={onClose}
            onCancel={onCancel}
            onIngredientUpdate={handleIngredientUpdate}
          />
        )}

        {showAddIngredientRecipeModal && (
          <AddIngredientRecipeModal
            ingredients={ingredientsData}
            ingredientsInRecipe={ingredients}
            onAddIngredient={handleAddIngredients}
            onCancell={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
