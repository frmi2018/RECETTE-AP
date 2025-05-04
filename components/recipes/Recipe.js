import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe } from "../../lib/api-recipes";
import { fetchIngredients } from "../../lib/api-ingredients";
import EditEtapes from "./EditEtapes/EditEtapes";
import RecipeIngredients from "./RecipeIngredients/RecipeIngredients";
import styles from "./Recipe.module.css";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [ingredientRecipe, setIngredientRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);

  // 🔧 Définie en dehors du useEffect pour pouvoir être réutilisée
  const loadData = async () => {
    try {
      const recipeData = await fetchRecipe(id);
      setRecipe(recipeData);

      const ingredientData = await fetchIngredients();
      setIngredientRecipe(ingredientData);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!recipe) return <p>Recette introuvable.</p>;

  return (
    <div className={styles.editEtapesContainer}>
      <h2 style={{ textAlign: "center" }}>{recipe.nom}</h2>

      <div className={styles.switchButtons}>
        <button
          onClick={() => setShowIngredients(true)}
          disabled={showIngredients}
          className={`${styles.switchButton} ${
            showIngredients ? styles.switchButtonActive : ""
          }`}
        >
          Ingrédients
        </button>
        <button
          onClick={() => setShowIngredients(false)}
          disabled={!showIngredients}
          className={`${styles.switchButton} ${
            !showIngredients ? styles.switchButtonActive : ""
          }`}
        >
          Étapes
        </button>
      </div>

      {showIngredients ? (
        <RecipeIngredients
          ingredients={recipe.ingrédients}
          recipeId={recipe.id}
          onUpdate={loadData} // ✅ maintenant ça fonctionne
        />
      ) : (
        <EditEtapes
          initialEtapes={recipe.etapes}
          recetteId={id}
          onUpdate={loadData} // ✅ maintenant ça fonctionne
        />
      )}
    </div>
  );
}
