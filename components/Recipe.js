import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchRecipe } from "../modules/recipeUtils";
import { fetchIngredients } from "../modules/ingredientUtils";
import EditEtapes from "./EditEtapes";
import styles from "./Recipe.module.css";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [ingredientRecipe, setIngredientRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // loadData : Cette fonction prend deux arguments :
    // fetchFunction : La fonction de récupération des données (comme fetchRecipe ou fetchIngredients).
    // setDataFunction : La fonction pour mettre à jour l'état (comme setRecipe ou setIngredientRecipe).

    const loadData = async (fetchFunction, setDataFunction) => {
      try {
        const data = await fetchFunction();
        setDataFunction(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData(() => fetchRecipe(id), setRecipe);
    loadData(fetchIngredients, setIngredientRecipe);
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
      <h3 className={styles.title}>Ingrédients</h3>
      <div>
        {recipe.ingrédients.map((ingredient, index) => (
          <p key={index}>{ingredient.id}</p>
        ))}
      </div>
      <h3 className={styles.title}>Etapes</h3>
      <div>
        {recipe.etapes.map((etape, index) => (
          <p key={index}>
            {index + 1}
            {" - "}
            {etape}
          </p>
        ))}
      </div>
      <button type="button" className={styles.ajouterBtn}>
        Editer les étapes
      </button>
      <EditEtapes initialEtapes={recipe.etapes} />
    </div>
  );
}
