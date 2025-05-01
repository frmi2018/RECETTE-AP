import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe } from "../../lib/recipeUtils";
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

  useEffect(() => {
    if (!id) return;

    const loadAllData = async () => {
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

    loadAllData();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!recipe) {
    return <p>Recette introuvable.</p>;
  }

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
          onUpdate={() => loadData(() => fetchRecipe(id), setRecipe)}
        />
      ) : (
        <EditEtapes initialEtapes={recipe.etapes} />
      )}
    </div>
  );
}
