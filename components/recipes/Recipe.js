import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe, fetchIngredientsByIds } from "@/lib/api-recipes";
import EditEtapes from "./EditEtapes/EditEtapes";
import RecipeIngredients from "./RecipeIngredients/RecipeIngredients";
import styles from "./Recipe.module.css";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;

  const [recipe, setRecipe] = useState(null);
  const [ingredientRecipe, setIngredientRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIngredients, setShowIngredients] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const recipeData = await fetchRecipe(id);
      setRecipe(recipeData);

      const ingredientIds = recipeData.ingredients?.map(ing => ing.id) || [];
      console.log("IDs des ingrédients envoyés :", ingredientIds);

      if (ingredientIds.length > 0) {
        const ingredientData = await fetchIngredientsByIds(ingredientIds);
        setIngredientRecipe(ingredientData);
      }
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!recipe) return <p>Recette introuvable.</p>;

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.titleContainer}>
        <div className={styles.cardImageWrapper}>
          <img
            src={recipe.image || "/images/icons/pas-image.png"}
            alt={recipe.nom || "Image par défaut"}
            className={recipe.image ? styles.cardImage : styles.addImage}
          />
        </div>

        <div className={styles.titleWrapper}>
          <h2>{recipe.nom}</h2>

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
        </div>
      </div>

      {showIngredients ? (
        <RecipeIngredients
          ingredients={ingredientRecipe}
          recipeId={id}
          onUpdate={loadData}
        />
      ) : (
        <EditEtapes
          initialEtapes={recipe.etapes}
          recipeId={id}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
